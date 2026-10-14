import { NextRequest, NextResponse } from 'next/server'
import { getSub, sendOne, subId } from '@/lib/push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const hits = new Map<string, number[]>()
const TXT = {
  th: ['ทดสอบการแจ้งเตือน', 'ระบบแจ้งเตือนน้ำท่วมหาดใหญ่ทำงานปกติ'],
  en: ['Test notification', 'Hat Yai Flood Watch alerts are working'],
  zh: ['通知测试', '合艾洪水预警通知正常']
} as const

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'x'
  const now = Date.now(), a = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  a.push(now); hits.set(ip, a); if (hits.size > 5000) hits.clear()
  if (a.length > 3) return NextResponse.json({ error: 'rate' }, { status: 429 })
  const b = await req.json().catch(() => null)
  if (!b || typeof b.endpoint !== 'string') return NextResponse.json({ error: 'invalid' }, { status: 400 })
  const s = await getSub(subId(b.endpoint)).catch(() => null)
  if (!s) return NextResponse.json({ error: 'none' }, { status: 404 })
  const [title, body] = TXT[s.lang as 'th' | 'en' | 'zh']
  const r = await sendOne(s, { title, body, level: 'watch', url: `/${s.lang}/alerts`, tag: 'test', sound: s.sound, test: true })
  return r === 'ok' ? NextResponse.json({ ok: true }) : NextResponse.json({ error: r }, { status: 502 })
}
