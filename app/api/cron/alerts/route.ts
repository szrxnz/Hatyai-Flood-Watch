import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { runAlerts } from '@/lib/alerts'
import { pushReady } from '@/lib/push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authed(req: NextRequest) {
  const s = process.env.CRON_SECRET
  if (!s) return false
  const got = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  return got.length === s.length && timingSafeEqual(Buffer.from(got), Buffer.from(s))
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'auth' }, { status: 401 })
  if (!pushReady()) return NextResponse.json({ error: 'VAPID keys missing' }, { status: 503 })
  try { return NextResponse.json(await runAlerts()) } catch (e) { console.error('alerts', e); return NextResponse.json({ error: 'failed' }, { status: 500 }) }
}
