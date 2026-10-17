import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { countSubs, delSub, endpointOk, getSub, MAX_SUBS, putSub, pushReady, subId } from '@/lib/push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const bad = (error: string, status: number) => NextResponse.json({ error }, { status })

const hits = new Map<string, number[]>()
function limited(k: string, max: number) {
  const now = Date.now(), a = (hits.get(k) ?? []).filter((t) => now - t < 600_000)
  a.push(now); hits.set(k, a)
  if (hits.size > 5000) hits.clear()
  return a.length > max
}
const ipOf = (req: NextRequest) => req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'x'

const schema = z.object({
  sub: z.object({ endpoint: z.string().max(700), keys: z.object({ p256dh: z.string().max(200), auth: z.string().max(100) }) }),
  amphoes: z.array(z.string().max(60)).max(30),
  min: z.enum(['watch', 'high', 'critical']),
  notices: z.boolean(),
  sound: z.enum(['siren', 'bell', 'beep', 'voice', 'silent']),
  lang: z.enum(['th', 'en', 'zh']),
  consent: z.literal(true),
})

export async function PUT(req: NextRequest) {
  if (!pushReady()) return bad('off', 503)
  if (limited(ipOf(req) + 's', 20)) return bad('rate', 429)
  const p = schema.safeParse(await req.json().catch(() => null))
  if (!p.success) return bad('invalid', 400)
  const { sub, consent: _c, ...rest } = p.data
  if (!endpointOk(sub.endpoint)) return bad('endpoint', 400)
  const id = subId(sub.endpoint)
  try {
    const prev = await getSub(id)
    if (!prev && (await countSubs()) >= MAX_SUBS) return bad('full', 503)
    await putSub({ id, sub, ...rest, at: prev?.at ?? Date.now(), seen: Date.now() })
    return NextResponse.json({ ok: true })
  } catch { return bad('storage', 500) }
}

export async function DELETE(req: NextRequest) {
  if (limited(ipOf(req) + 'd', 20)) return bad('rate', 429)
  const b = await req.json().catch(() => null)
  if (!b || typeof b.endpoint !== 'string') return bad('invalid', 400)
  try { await delSub(subId(b.endpoint)); return NextResponse.json({ ok: true }) } catch { return bad('storage', 500) }
}
