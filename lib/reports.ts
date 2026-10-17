import { promises as fs } from 'fs'
import path from 'path'

export interface Report { id: string; lat: number; lng: number; note: string; at: number; flags: string[]; oks?: string[]; by?: string }
export interface PublicReport { id: string; lat: number; lng: number; note: string; at: number; ok: number }
export interface AdminReport extends PublicReport { flags: number; hidden: boolean }

export const CONFIRM_KM = 1

const TTL = 24 * 3600_000
const MAX_FLAGS = 3
const DIR = path.join(process.cwd(), 'data', 'reports')
const U = process.env.UPSTASH_REDIS_REST_URL, T = process.env.UPSTASH_REDIS_REST_TOKEN
const remote = !!(U && T)

async function redis(cmd: (string | number)[]) {
  const r = await fetch(U!, { method: 'POST', headers: { Authorization: `Bearer ${T}` }, body: JSON.stringify(cmd), cache: 'no-store' })
  if (!r.ok) throw new Error('redis')
  return (await r.json()).result
}

async function readAll(): Promise<Report[]> {
  try {
    const raw = remote ? await redis(['GET', 'reports']) : await fs.readFile(path.join(DIR, 'index.json'), 'utf8')
    return JSON.parse(raw || '[]')
  } catch { return [] }
}

async function writeAll(list: Report[]) {
  const s = JSON.stringify(list)
  if (remote) { await redis(['SET', 'reports', s]); return }
  await fs.mkdir(DIR, { recursive: true })
  await fs.writeFile(path.join(DIR, 'index.json'), s)
}

const nOk = (r: Report) => r.oks?.length ?? 0
const hidden = (r: Report) => r.flags.length >= MAX_FLAGS && r.flags.length > nOk(r)
const live = (r: Report) => Date.now() - r.at < TTL && !hidden(r)
const strip = (r: Report): PublicReport => ({ id: r.id, lat: r.lat, lng: r.lng, note: r.note, at: r.at, ok: nOk(r) })

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

export async function listReports(): Promise<PublicReport[]> {
  return (await readAll()).filter(live).sort((a, b) => b.at - a.at).slice(0, 60).map(strip)
}

export async function listReportsAdmin(): Promise<AdminReport[]> {
  return (await readAll())
    .filter((r) => Date.now() - r.at < TTL * 2)
    .sort((a, b) => b.flags.length - a.flags.length || b.at - a.at)
    .map((r) => ({ ...strip(r), flags: r.flags.length, hidden: !live(r) }))
}

export async function addReport(r: { lat: number; lng: number; note: string }, jpg: Buffer, by?: string) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  if (remote) await redis(['SET', `rpimg:${id}`, jpg.toString('base64'), 'EX', 86400 * 2])
  else { await fs.mkdir(DIR, { recursive: true }); await fs.writeFile(path.join(DIR, `${id}.jpg`), jpg) }
  const item: Report = { id, ...r, at: Date.now(), flags: [], oks: [], by }
  const keep = (await readAll()).filter((x) => Date.now() - x.at < TTL * 2)
  await writeAll([item, ...keep].slice(0, 300))
  return strip(item)
}

export async function getImage(id: string): Promise<Buffer | null> {
  if (!/^[a-z0-9]{6,20}$/.test(id)) return null
  try {
    if (remote) { const v = await redis(['GET', `rpimg:${id}`]); return v ? Buffer.from(v, 'base64') : null }
    return await fs.readFile(path.join(DIR, `${id}.jpg`))
  } catch { return null }
}

export async function flagReport(id: string, who: string) {
  const list = await readAll()
  const r = list.find((x) => x.id === id)
  if (!r) return false
  if (!r.flags.includes(who)) r.flags.push(who)
  await writeAll(list)
  return true
}

export type ConfirmResult = { s: 'ok'; n: number } | { s: 'none' | 'far' | 'own' }

export async function confirmReport(id: string, who: string, lat: number, lng: number): Promise<ConfirmResult> {
  const list = await readAll()
  const r = list.find((x) => x.id === id)
  if (!r) return { s: 'none' }
  if (r.by && r.by === who) return { s: 'own' }
  if (km(r, { lat, lng }) > CONFIRM_KM) return { s: 'far' }
  r.oks = r.oks ?? []
  if (!r.oks.includes(who)) { r.oks.push(who); await writeAll(list) }
  return { s: 'ok', n: r.oks.length }
}

export async function removeReport(id: string) {
  await writeAll((await readAll()).filter((x) => x.id !== id))
  if (!/^[a-z0-9]{6,20}$/.test(id)) return
  try {
    if (remote) await redis(['DEL', `rpimg:${id}`])
    else await fs.unlink(path.join(DIR, `${id}.jpg`))
  } catch {}
}
