import { readJson, writeJson } from './kv'

export type Kind = 'rain' | 'flood' | 'evac' | 'info'
export type NLevel = 'info' | 'watch' | 'high' | 'critical'
export interface Notice { id: string; kind: Kind; level: NLevel; title: string; body: string; areas: string[]; at: number; until: number }

const readAll = () => readJson<Notice[]>('notices', 'notices.json', [])
const writeAll = (list: Notice[]) => writeJson('notices', 'notices.json', list)

export async function listNotices(all = false) {
  const now = Date.now()
  return (await readAll()).filter((n) => all || n.until > now).sort((a, b) => b.at - a.at)
}

export async function addNotice(n: Omit<Notice, 'id' | 'at'>) {
  const list = await readAll()
  const item: Notice = { ...n, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: Date.now() }
  await writeAll([item, ...list].slice(0, 200))
  return item
}

export async function removeNotice(id: string) {
  await writeAll((await readAll()).filter((n) => n.id !== id))
}
