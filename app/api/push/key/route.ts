import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export function GET() {
  const k = process.env.VAPID_PUBLIC_KEY
  return k ? NextResponse.json({ key: k }) : NextResponse.json({ error: 'off' }, { status: 503 })
}
