import { NextRequest, NextResponse } from 'next/server'
import { createECDH } from 'crypto'
import { isAdmin } from '@/lib/auth'
import { allSubs, pushReady, sendOneD, storeKind } from '@/lib/push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const host = (e: string) => { try { return new URL(e).host } catch { return '?' } }
const days = (t?: number) => (t ? Math.round(((Date.now() - t) / 86400_000) * 10) / 10 : null)

function vapidCheck() {
  const pub = (process.env.VAPID_PUBLIC_KEY || '').trim(), priv = (process.env.VAPID_PRIVATE_KEY || '').trim()
  const subject = process.env.VAPID_SUBJECT || ''
  let pair: boolean | null = null
  try {
    const e = createECDH('prime256v1'); e.setPrivateKey(Buffer.from(priv, 'base64url'))
    pair = e.getPublicKey().equals(Buffer.from(pub, 'base64url'))
  } catch { pair = null }
  return {
    ready: pushReady(),
    pairMatches: pair,
    pubBytes: pub ? Buffer.from(pub, 'base64url').length : 0,
    subject,
    subjectOk: /^(mailto:[^@\s]+@[^@\s]+\.[^@\s]+|https:\/\/.+)$/.test(subject) && !/example\.com/.test(subject),
    cronSecretSet: !!process.env.CRON_SECRET,
    store: storeKind(),
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'auth' }, { status: 401 })
  try {
    const subs = (await allSubs()).map((s) => ({
      id: s.id.slice(0, 8), host: host(s.sub.endpoint), lang: s.lang, min: s.min, notices: s.notices,
      amphoes: s.amphoes, ageDays: days(s.at), seenDays: days(s.seen),
    }))
    return NextResponse.json({ vapid: vapidCheck(), subs })
  } catch (e: any) { return NextResponse.json({ vapid: vapidCheck(), subs: [], error: String(e?.message || e) }, { status: 500 }) }
}

// ส่งทดสอบถึงทุกเครื่อง (ไม่สร้างประกาศ ไม่ลบ subscription ที่หมดอายุ) พร้อมรายงานผลรายเครื่อง
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'auth' }, { status: 401 })
  const subs = await allSubs().catch(() => [])
  const t0 = Date.now()
  const results = await Promise.all(subs.map(async (s) => {
    const t = Date.now()
    const d = await sendOneD(s, { title: 'ทดสอบ push (admin)', body: 'ทดสอบจากหน้าแอดมิน', level: 'watch', url: `/${s.lang}`, tag: 'admintest', sound: s.sound, test: true })
    return { id: s.id.slice(0, 8), host: host(s.sub.endpoint), result: d.r, err: d.err, ms: Date.now() - t }
  }))
  return NextResponse.json({ results, totalMs: Date.now() - t0 })
}
