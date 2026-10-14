import { NextRequest, NextResponse } from 'next/server'
import { COOKIE, isAdmin, makeToken, passwordOk } from '@/lib/auth'

export const runtime = 'nodejs'
const hits = new Map<string, number[]>()

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: isAdmin(req), configured: !!process.env.ADMIN_PASSWORD })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'x'
  const now = Date.now()
  const h = (hits.get(ip) ?? []).filter((x) => now - x < 600000)
  if (h.length >= 5) return NextResponse.json({ error: 'rate' }, { status: 429 })
  hits.set(ip, [...h, now])
  let p = ''
  try { p = String((await req.json()).password ?? '') } catch {}
  if (!passwordOk(p)) return NextResponse.json({ error: 'auth' }, { status: 401 })
  const https = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto')?.split(',')[0].trim() === 'https'
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, makeToken(), { httpOnly: true, sameSite: 'strict', secure: https, path: '/', maxAge: 12 * 3600 })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
