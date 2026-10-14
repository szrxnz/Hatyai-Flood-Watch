import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

export const COOKIE = 'adm'
const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || ''
const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('hex')
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

export const passwordOk = (p: string) => !!process.env.ADMIN_PASSWORD && same(sign(p), sign(process.env.ADMIN_PASSWORD))
export const makeToken = () => { const exp = String(Date.now() + 12 * 3600_000); return `${exp}.${sign(exp)}` }
export function isAdmin(req: NextRequest) {
  const v = req.cookies.get(COOKIE)?.value
  if (!v || !secret()) return false
  const [exp, sig] = v.split('.')
  return !!exp && !!sig && Number(exp) > Date.now() && same(sig, sign(exp))
}
