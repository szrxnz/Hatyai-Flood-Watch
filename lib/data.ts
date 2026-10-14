import { Lang, Level, Name, StationView } from './types'
import { fetchStations } from './sources/thaiwater'
import { computeStatus } from './status'

const RANK: Record<Level, number> = { critical: 0, high: 1, watch: 2, normal: 3, nodata: 4 }
export async function getStationViews(lang: Lang): Promise<StationView[]> {
  const pick = (n: Name) => (lang === 'th' ? n.th || n.en : n.en || n.th) || '-'
  const views = (await fetchStations()).map((s): StationView => {
    const { status, diff } = computeStatus(s.level, s.at, s.bank)
    return { id: s.id, name: pick(s.name), river: s.river ?? '', lat: s.lat, lng: s.lng,
      level: status === 'nodata' ? null : s.level, diff,
      trend: status !== 'nodata' && s.prev != null ? +(s.level - s.prev).toFixed(2) : null, status, at: s.at,
      amphoe: pick(s.amphoe), areaKey: `${pick(s.amphoe)}|${pick(s.tambon)}`, areaName: `${pick(s.tambon)} · ${pick(s.amphoe)}` }
  })
  return views.sort((a, b) => RANK[a.status] - RANK[b.status] || (b.diff ?? -99) - (a.diff ?? -99))
}
export function buildAreas(v: StationView[]) {
  const m = new Map<string, { id: string; name: string; la: number; ln: number; n: number }>()
  for (const s of v) {
    const a = m.get(s.areaKey) ?? { id: s.areaKey, name: s.areaName, la: 0, ln: 0, n: 0 }
    a.la += s.lat; a.ln += s.lng; a.n++; m.set(s.areaKey, a)
  }
  return [...m.values()].map((a) => ({ id: a.id, name: a.name, lat: a.la / a.n, lng: a.ln / a.n }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const fmtTime = (iso: string | null, lang: Lang) =>
  iso ? new Date(iso).toLocaleString({ th: 'th-TH', en: 'en-GB', zh: 'zh-CN' }[lang], { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
