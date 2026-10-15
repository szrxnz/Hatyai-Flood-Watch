import { promises as fs } from 'fs'
import path from 'path'
import { createHash } from 'crypto'
import webpush from 'web-push'

export type PLevel = 'watch' | 'high' | 'critical'
export const PRANK: Record<string, number> = { info: 0, watch: 1, high: 2, critical: 3 }
export interface SubJSON { endpoint: string; keys: { p256dh: string; auth: string } }
export interface PushSub { id: string; sub: SubJSON; amphoes: string[]; min: PLevel; notices: boolean; sound: string; lang: 'th' | 'en' | 'zh'; at: number; seen: number }
export interface Payload { title: string; body: string; level: string; url: string; tag: string; sound: string; test?: boolean }

const U = process.env.UPSTASH_REDIS_REST_URL, T = process.env.UPSTASH_REDIS_REST_TOKEN
const remote = !!(U && T)
const FILE = path.join(process.cwd(), 'data', 'pushsubs.json')
export const MAX_SUBS = 50000

const ENDPOINT_OK = /^https:\/\/(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+\.push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9-]+\.push\.apple\.com|[a-z0-9.-]+\.notify\.windows\.com)\/[\w\-./~%:@!$&'()*+,;=?]*$/i
export const endpointOk = (e: string) => e.length < 700 && ENDPOINT_OK.test(e)
export const subId = (endpoint: string) => createHash('sha256').update(endpoint).digest('hex').slice(0, 24)

async function redis(cmd: (string | number)[]) {
  const r = await fetch(U!, { method: 'POST', headers: { Authorization: `Bearer ${T}` }, body: JSON.stringify(cmd), cache: 'no-store' })
  if (!r.ok) throw new Error('redis')
  return (await r.json()).result
}
async function fileRead(): Promise<Record<string, PushSub>> { try { return JSON.parse(await fs.readFile(FILE, 'utf8')) } catch { return {} } }
const fileWrite = (m: Record<string, PushSub>) => fs.writeFile(FILE, JSON.stringify(m))

export async function putSub(s: PushSub) {
  if (remote) { await redis(['HSET', 'push:subs', s.id, JSON.stringify(s)]); return }
  const m = await fileRead(); m[s.id] = s; await fileWrite(m)
}
export async function getSub(id: string): Promise<PushSub | null> {
  if (remote) { const v = await redis(['HGET', 'push:subs', id]); return v ? JSON.parse(v) : null }
  return (await fileRead())[id] ?? null
}
export async function delSub(id: string) {
  if (remote) { await redis(['HDEL', 'push:subs', id]); return }
  const m = await fileRead(); delete m[id]; await fileWrite(m)
}
export async function allSubs(): Promise<PushSub[]> {
  if (remote) {
    const a: string[] = (await redis(['HGETALL', 'push:subs'])) ?? []
    const out: PushSub[] = []
    for (let i = 1; i < a.length; i += 2) { try { out.push(JSON.parse(a[i])) } catch {} }
    return out
  }
  return Object.values(await fileRead())
}
export async function countSubs() {
  if (remote) return Number(await redis(['HLEN', 'push:subs'])) || 0
  return Object.keys(await fileRead()).length
}

let ready = false
function init() {
  const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !priv) return false
  if (!ready) { webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@example.com', pub, priv); ready = true }
  return true
}
export const pushReady = () => !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)

const VIB: Record<string, number[]> = { critical: [400, 150, 400, 150, 400, 150, 800], high: [300, 120, 300, 120, 300], watch: [200, 100, 200], info: [150] }

export let lastPushErr = ''
type SendRes = { r: 'ok' | 'gone' | 'fail'; err: string }
async function sendOneD(s: PushSub, p: Payload): Promise<SendRes> {
  if (!init()) return { r: 'fail', err: 'VAPID key not set' }
  const urgent = p.level === 'critical' || p.level === 'high'
  try {
    await webpush.sendNotification(s.sub, JSON.stringify({ ...p, vibrate: VIB[p.level] ?? VIB.info, urgent }), {
      TTL: p.test ? 300 : 3 * 3600,
      urgency: urgent ? 'high' : 'normal',
      topic: p.tag.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || undefined,
      timeout: 8000,
    })
    return { r: 'ok', err: '' }
  } catch (e: any) {
    const err = `${e?.statusCode ?? ''} ${String(e?.body || e?.message || '').slice(0, 150)}`.trim()
    lastPushErr = err
    return { r: e?.statusCode === 404 || e?.statusCode === 410 ? 'gone' : 'fail', err }
  }
}
export async function sendOne(s: PushSub, p: Payload): Promise<'ok' | 'gone' | 'fail'> { return (await sendOneD(s, p)).r }

export async function sendMany(items: { s: PushSub; p: Payload }[]) {
  let ok = 0, gone = 0, fail = 0
  const errs = new Set<string>()
  for (let i = 0; i < items.length; i += 25) {
    const res = await Promise.all(items.slice(i, i + 25).map(async ({ s, p }) => {
      const d = await sendOneD(s, p)
      if (d.r === 'gone') await delSub(s.id).catch(() => {})
      if (d.err && errs.size < 3) errs.add(d.err)
      return d.r
    }))
    for (const r of res) r === 'ok' ? ok++ : r === 'gone' ? gone++ : fail++
  }
  return { ok, gone, fail, errs: [...errs] }
}
