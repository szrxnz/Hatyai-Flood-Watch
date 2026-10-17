import { useEffect, useState } from 'react'
import { haversineKm } from './geo'
import type { Lang } from './types'

type Ring = number[][] // [lng, lat][]
export interface Tambon {
  code: string; th: string; en: string
  ac: string; ath: string; aen: string
  lat: number; lng: number
  polys: Ring[][] // polygon -> rings (0 = outer, rest = holes)
  bbox: [number, number, number, number] // minLng, minLat, maxLng, maxLat
}
export interface Amphoe { code: string; th: string; en: string; tambons: Tambon[] }
export interface Zones { tambons: Tambon[]; amphoes: Amphoe[]; byCode: Map<string, Tambon>; amphoeByCode: Map<string, Amphoe> }
export interface ZoneSel { ac: string; tc: string }
export const NO_ZONE: ZoneSel = { ac: '', tc: '' }

const GEOJSON = '/songkhla-tambons.geojson'
const NEAREST_KM = 8 // จุดที่ไม่ตกในพอลิกอนใด (เช่น ริมทะเลสาบ) ให้ใช้ตำบลที่ใกล้ที่สุดไม่เกินระยะนี้

export function buildZones(gj: any): Zones {
  const tambons: Tambon[] = []
  for (const f of gj?.features ?? []) {
    const p = f.properties ?? {}, g = f.geometry
    if (!g || !p.pcode) continue
    const polys: Ring[][] = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []
    let x0 = 999, y0 = 999, x1 = -999, y1 = -999
    for (const poly of polys) for (const [x, y] of poly[0]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
    tambons.push({
      code: p.pcode, th: p.nameTh ?? '', en: p.nameEn ?? p.nameTh ?? '',
      ac: p.amphoePcode, ath: p.amphoeTh ?? '', aen: p.amphoeEn ?? p.amphoeTh ?? '',
      lat: p.lat, lng: p.lon, polys, bbox: [x0, y0, x1, y1],
    })
  }
  const amphoeByCode = new Map<string, Amphoe>()
  for (const tb of tambons) {
    const a = amphoeByCode.get(tb.ac) ?? { code: tb.ac, th: tb.ath, en: tb.aen, tambons: [] }
    a.tambons.push(tb); amphoeByCode.set(tb.ac, a)
  }
  const amphoes = [...amphoeByCode.values()].sort((a, b) => a.th.localeCompare(b.th, 'th'))
  for (const a of amphoes) a.tambons.sort((x, y) => x.th.localeCompare(y.th, 'th'))
  return { tambons, amphoes, byCode: new Map(tambons.map((x) => [x.code, x])), amphoeByCode }
}

let cache: Promise<Zones | null> | null = null
export function loadZones(): Promise<Zones | null> {
  if (!cache) {
    cache = fetch(GEOJSON).then((r) => (r.ok ? r.json() : null)).then((j) => (j ? buildZones(j) : null)).catch(() => null)
    cache.then((z) => { if (!z) cache = null })
  }
  return cache
}
export function useZones(): Zones | null {
  const [z, setZ] = useState<Zones | null>(null)
  useEffect(() => { let on = true; loadZones().then((v) => { if (on) setZ(v) }); return () => { on = false } }, [])
  return z
}

function inRing(x: number, y: number, ring: Ring) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const inPoly = (x: number, y: number, poly: Ring[]) => inRing(x, y, poly[0]) && !poly.slice(1).some((h) => inRing(x, y, h))

/** หาตำบล/อำเภอจากพิกัด: ตรวจว่าจุดอยู่ในพอลิกอนตำบลไหน ถ้าไม่ตกในพอลิกอนใดเลยใช้ตำบลที่ใกล้ที่สุด (ไม่เกิน 8 กม.) */
export function zoneOf(z: Zones, lat: number, lng: number): (ZoneSel & { exact: boolean }) | null {
  for (const tb of z.tambons) {
    const [x0, y0, x1, y1] = tb.bbox
    if (lng < x0 || lng > x1 || lat < y0 || lat > y1) continue
    if (tb.polys.some((p) => inPoly(lng, lat, p))) return { ac: tb.ac, tc: tb.code, exact: true }
  }
  let best: Tambon | null = null, bd = Infinity
  for (const tb of z.tambons) { const d = haversineKm({ lat, lng }, tb); if (d < bd) { bd = d; best = tb } }
  return best && bd <= NEAREST_KM ? { ac: best.ac, tc: best.code, exact: false } : null
}

/** จับคู่ชื่ออำเภอที่พิมพ์เป็นข้อความ (เช่น ศูนย์พักพิงที่ไม่มีพิกัด) กับอำเภอในข้อมูล */
export function amphoeFromText(z: Zones, text: string): string {
  const s = text.trim().replace(/^(อำเภอ|อ\.|amphoe|district)\s*/i, '').toLowerCase()
  if (!s) return ''
  const hit = z.amphoes.find((a) => a.th === s || a.en.toLowerCase() === s) ?? z.amphoes.find((a) => a.th.includes(s) || a.en.toLowerCase().includes(s))
  return hit?.code ?? ''
}

export const amphoeName = (a: { th: string; en: string }, lang: Lang) => (lang === 'th' ? a.th : a.en)
export const tambonName = (tb: Tambon, lang: Lang) => (lang === 'th' ? tb.th : tb.en)
export const zoneLabel = (z: Zones, s: ZoneSel, lang: Lang) => {
  const tb = s.tc ? z.byCode.get(s.tc) : null, a = z.amphoeByCode.get(s.ac)
  if (tb) return lang === 'th' ? `ต.${tb.th} อ.${tb.ath}` : `${tb.en}, ${tb.aen}`
  if (a) return lang === 'th' ? `อ.${a.th}` : a.en
  return ''
}
