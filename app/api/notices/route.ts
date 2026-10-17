import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdmin } from '@/lib/auth'
import { addNotice, listNotices, removeNotice } from '@/lib/store'
import { pushNotice } from '@/lib/alerts'
import { pushReady } from '@/lib/push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const schema = z.object({
  kind: z.enum(['rain', 'flood', 'evac', 'info']),
  level: z.enum(['info', 'watch', 'high', 'critical']),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().max(1000),
  areas: z.array(z.string().max(60)).max(30),
  hours: z.number().min(1).max(168),
  push: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === '1' && isAdmin(req)
  return NextResponse.json(await listNotices(all), { headers: { 'Cache-Control': all ? 'no-store' : 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' } })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'auth' }, { status: 401 })
  const p = schema.safeParse(await req.json().catch(() => null))
  if (!p.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const { hours, push, ...rest } = p.data
  try {
    const item = await addNotice({ ...rest, until: Date.now() + hours * 3600_000 })
    let sent: unknown = null
    if (push && pushReady()) { try { sent = await pushNotice(item) } catch (e) { console.error('pushNotice', e) } }
    return NextResponse.json({ ...item, push: sent })
  } catch { return NextResponse.json({ error: 'storage' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'auth' }, { status: 401 })
  try { await removeNotice(req.nextUrl.searchParams.get('id') ?? ''); return NextResponse.json({ ok: true }) }
  catch { return NextResponse.json({ error: 'storage' }, { status: 500 }) }
}
