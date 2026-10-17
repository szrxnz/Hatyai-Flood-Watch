import { promises as fs } from 'fs'
import path from 'path'

const U = process.env.UPSTASH_REDIS_REST_URL, T = process.env.UPSTASH_REDIS_REST_TOKEN

async function redis(cmd: string[]) {
  const r = await fetch(U!, { method: 'POST', headers: { Authorization: `Bearer ${T}` }, body: JSON.stringify(cmd), cache: 'no-store' })
  if (!r.ok) throw new Error('redis')
  return (await r.json()).result
}

export async function readJson<V>(key: string, file: string, fallback: V): Promise<V> {
  try {
    if (U && T) return JSON.parse((await redis(['GET', key])) || 'null') ?? fallback
    return JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', file), 'utf8'))
  } catch { return fallback }
}

export async function writeJson(key: string, file: string, value: unknown) {
  if (U && T) { await redis(['SET', key, JSON.stringify(value)]); return }
  await fs.writeFile(path.join(process.cwd(), 'data', file), JSON.stringify(value, null, 2))
}
