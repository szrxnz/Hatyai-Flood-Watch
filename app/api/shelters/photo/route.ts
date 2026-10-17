import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { getPhoto } from '@/lib/blob'
import { addShelterPhoto, removeShelterPhoto } from '@/lib/shelters'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const bad = (error: string, status: number) => NextResponse.json({ error }, { status })

export async function GET(req: NextRequest) {
  const img = await getPhoto(req.nextUrl.searchParams.get('id') ?? '')
  if (!img) return bad('none', 404)
  return new NextResponse(new Uint8Array(img), { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' } })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return bad('auth', 401)
  let fd: FormData
  try { fd = await req.formData() } catch { return bad('form', 400) }
  const f = fd.get('photo'), sid = String(fd.get('shelter') ?? '')
  if (!(f instanceof File) || f.type !== 'image/jpeg' || f.size > 450_000 || !sid) return bad('invalid', 400)
  const buf = Buffer.from(await f.arrayBuffer())
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return bad('invalid', 400)
  try {
    const r = await addShelterPhoto(sid, buf)
    if (r === 'none') return bad('none', 404)
    if (r === 'full') return bad('full', 409)
    return NextResponse.json(r)
  } catch { return bad('storage', 500) }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return bad('auth', 401)
  const q = req.nextUrl.searchParams
  try { return (await removeShelterPhoto(q.get('shelter') ?? '', q.get('id') ?? '')) ? NextResponse.json({ ok: true }) : bad('none', 404) } catch { return bad('storage', 500) }
}
