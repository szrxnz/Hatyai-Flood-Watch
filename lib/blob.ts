import { promises as fs } from 'fs'
import path from 'path'

const U = process.env.UPSTASH_REDIS_REST_URL, T = process.env.UPSTASH_REDIS_REST_TOKEN
const remote = !!(U && T)
const DIR = path.join(process.cwd(), 'data', 'shelter-img')
const okId = (id: string) => /^[a-z0-9]{6,20}$/.test(id)

async function redis(cmd: (string | number)[]) {
  const r = await fetch(U!, { method: 'POST', headers: { Authorization: `Bearer ${T}` }, body: JSON.stringify(cmd), cache: 'no-store' })
  if (!r.ok) throw new Error('redis')
  return (await r.json()).result
}

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

export async function putPhoto(id: string, jpg: Buffer) {
  if (remote) { await redis(['SET', `shimg:${id}`, jpg.toString('base64')]); return }
  await fs.mkdir(DIR, { recursive: true })
  await fs.writeFile(path.join(DIR, `${id}.jpg`), jpg)
}

export async function getPhoto(id: string): Promise<Buffer | null> {
  if (!okId(id)) return null
  try {
    if (remote) { const v = await redis(['GET', `shimg:${id}`]); return v ? Buffer.from(v, 'base64') : null }
    return await fs.readFile(path.join(DIR, `${id}.jpg`))
  } catch { return null }
}

export async function delPhoto(id: string) {
  if (!okId(id)) return
  try {
    if (remote) await redis(['DEL', `shimg:${id}`])
    else await fs.unlink(path.join(DIR, `${id}.jpg`))
  } catch {}
}
