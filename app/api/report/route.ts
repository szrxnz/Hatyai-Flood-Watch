import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { addReport, confirmReport, flagReport, getImage, listReports, listReportsAdmin, removeReport } from '@/lib/reports'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const hits = new Map<string, number[]>()
const bad = (error: string, status: number) => NextResponse.json({ error }, { status })
const ipOf = (req: NextRequest) => req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'x'
const whoOf = (ip: string) => createHash('sha256').update(ip + (process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || 'hatyai')).digest('hex').slice(0, 16)

function limited(ip: string, max: number) {
  const now = Date.now()
  if (hits.size > 5000) hits.clear()
  const h = (hits.get(ip) ?? []).filter((x) => now - x < 600000)
  if (h.length >= max) return true
  hits.set(ip, [...h, now])
  return false
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (req.nextUrl.searchParams.get('all')) {
    if (!isAdmin(req)) return bad('auth', 401)
    return NextResponse.json(await listReportsAdmin(), { headers: { 'Cache-Control': 'no-store' } })
  }
  if (id) {
    const img = await getImage(id)
    if (!img) return bad('none', 404)
    return new NextResponse(new Uint8Array(img), { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' } })
  }
  return NextResponse.json(await listReports(), { headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' } })
}

export async function POST(req: NextRequest) {
  const ip = ipOf(req)
  if (limited(ip, 3)) return bad('rate', 429)
  let fd: FormData
  try { fd = await req.formData() } catch { return bad('form', 400) }
  const f = fd.get('photo')
  const lat = Number(fd.get('lat')), lng = Number(fd.get('lng'))
  const note = String(fd.get('note') ?? '').replace(/\s+/g, ' ').trim().slice(0, 200)
  if (!(f instanceof File) || f.type !== 'image/jpeg' || f.size > 600_000 || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < 5.9 || lat > 7.7 || lng < 99.6 || lng > 101.5) return bad('invalid', 400)
  const buf = Buffer.from(await f.arrayBuffer())
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return bad('invalid', 400)
  try {
    const item = await addReport({ lat: Math.round(lat * 1e4) / 1e4, lng: Math.round(lng * 1e4) / 1e4, note }, buf, whoOf(ip))
    return NextResponse.json(item)
  } catch { return bad('storage', 500) }
}

export async function PATCH(req: NextRequest) {
  const ip = ipOf(req)
  const b = await req.json().catch(() => null)
  if (!b || typeof b.id !== 'string') return bad('invalid', 400)
  if (b.act === 'confirm') {
    if (limited(ip + 'c', 20)) return bad('rate', 429)
    const lat = Number(b.lat), lng = Number(b.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return bad('invalid', 400)
    try {
      const r = await confirmReport(b.id, whoOf(ip), lat, lng)
      if (r.s === 'ok') return NextResponse.json({ ok: true, n: r.n })
      return bad(r.s, r.s === 'none' ? 404 : r.s === 'far' ? 403 : 409)
    } catch { return bad('storage', 500) }
  }
  if (limited(ip + 'f', 10)) return bad('rate', 429)
  try { return (await flagReport(b.id, whoOf(ip))) ? NextResponse.json({ ok: true }) : bad('none', 404) } catch { return bad('storage', 500) }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return bad('auth', 401)
  try { await removeReport(req.nextUrl.searchParams.get('id') ?? ''); return NextResponse.json({ ok: true }) } catch { return bad('storage', 500) }
}
