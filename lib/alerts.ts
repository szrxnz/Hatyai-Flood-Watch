import { readJson, writeJson } from './kv'
import { allSubs, delSub, Payload, PRANK, PushSub, sendMany } from './push'
import { getStationViews } from './data'
import { fetchRain } from './tmd'
import type { Notice } from './store'

type St = Record<string, { r: number; nr: number; nt: number }> & { __rain?: any }
const COOL = 3 * 3600_000
const RAIN_MM = 30
const STALE_SUB = 180 * 86400_000

const L = {
  th: {
    crit: (n: number, names: string) => [`น้ำเกินตลิ่ง ${n} สถานี`, names], high: (n: number, names: string) => [`น้ำเสี่ยงสูง ${n} สถานี`, names], watch: (n: number, names: string) => [`เฝ้าระวังน้ำ ${n} สถานี`, names],
    rain: (mm: number) => ['ฝนตกหนักในหาดใหญ่', `คาดว่ามีฝนสะสมราว ${mm} มม. ใน 3 ชั่วโมงข้างหน้า`],
  },
  en: {
    crit: (n: number, names: string) => [`Water above bank at ${n} station(s)`, names], high: (n: number, names: string) => [`High flood risk at ${n} station(s)`, names], watch: (n: number, names: string) => [`Water watch at ${n} station(s)`, names],
    rain: (mm: number) => ['Heavy rain in Hat Yai', `About ${mm} mm expected in the next 3 hours`],
  },
  zh: {
    crit: (n: number, names: string) => [`${n} 个站点水位超过堤岸`, names], high: (n: number, names: string) => [`${n} 个站点洪水风险高`, names], watch: (n: number, names: string) => [`${n} 个站点需留意水位`, names],
    rain: (mm: number) => ['合艾暴雨预警', `未来3小时预计降雨约 ${mm} 毫米`],
  },
} as const

const lvName = ['', 'watch', 'high', 'critical']

export async function runAlerts() {
  const now = Date.now(), t0 = now
  const views = (await getStationViews('th')).filter((s) => s.status !== 'nodata')
  const prev = await readJson<St | null>('pushstate', 'pushstate.json', null)
  const seeded = prev !== null
  const st: St = { ...(prev ?? {}) } as St
  const events: { id: string; name: string; amphoe: string; rank: number }[] = []
  for (const s of views) {
    const r = s.status === 'critical' ? 3 : s.status === 'high' ? 2 : s.status === 'watch' ? 1 : 0
    const o = st[s.id] ?? { r: 0, nr: 0, nt: 0 }
    if (o.nr > r && now - o.nt > COOL) o.nr = r
    if (r > o.nr) { o.nr = r; o.nt = now; if (seeded) events.push({ id: s.id, name: s.name, amphoe: s.amphoe, rank: r }) }
    o.r = r; st[s.id] = o
  }

  let rainMm = 0
  try {
    const rain = await fetchRain(7.0086, 100.4747)
    rainMm = rain ? Math.round(rain.slice(0, 3).reduce((a, h) => a + (h.mm || 0), 0)) : 0
  } catch {}
  const rs = st.__rain as { nt: number } | undefined
  const rainGo = seeded && rainMm >= RAIN_MM && (!rs || now - rs.nt > COOL)
  if (rainGo) st.__rain = { nt: now }

  await writeJson('pushstate', 'pushstate.json', st)

  const subs = await allSubs()
  const purge = subs.filter((s) => now - (s.seen ?? s.at) > STALE_SUB)
  await Promise.all(purge.map((s) => delSub(s.id).catch(() => {})))
  const live = subs.filter((s) => !purge.includes(s))

  const items: { s: PushSub; p: Payload }[] = []
  for (const s of live) {
    const mine = events.filter((e) => e.rank >= PRANK[s.min] && (!s.amphoes.length || s.amphoes.includes(e.amphoe)))
    if (mine.length) {
      const top = Math.max(...mine.map((e) => e.rank))
      const names = mine.filter((e) => e.rank === top).map((e) => e.name)
      const t = L[s.lang]
      const [title, body] = (top === 3 ? t.crit : top === 2 ? t.high : t.watch)(names.length, names.slice(0, 4).join(', ') + (names.length > 4 ? ` +${names.length - 4}` : ''))
      items.push({ s, p: { title, body, level: lvName[top], url: `/${s.lang}`, tag: 'water', sound: s.sound } })
    }
    if (rainGo && PRANK[s.min] <= 2) {
      const [title, body] = L[s.lang].rain(rainMm)
      items.push({ s, p: { title, body, level: 'high', url: `/${s.lang}/forecast`, tag: 'rain', sound: s.sound } })
    }
  }
  const res = await sendMany(items)
  return { stations: views.length, events: events.length, rainMm, subs: live.length, purged: purge.length, sent: items.length, ...res, seededNow: !seeded, totalMs: Date.now() - t0 }
}

export async function pushNotice(n: Notice) {
  const subs = (await allSubs()).filter((s) => s.notices && (!n.areas.length || !s.amphoes.length || n.areas.some((a) => s.amphoes.includes(a))))
  const level = n.level === 'info' ? 'watch' : n.level
  const res = await sendMany(subs.map((s) => ({ s, p: { title: n.title, body: n.body.slice(0, 140), level, url: `/${s.lang}/notices#${n.id}`, tag: `n${n.id}`, sound: s.sound } })))
  return { targets: subs.length, ...res }
}
