'use client'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Ic, iconSvg } from '@/components/Icons'
import { FLOWS } from '@/lib/flow'
import 'leaflet/dist/leaflet.css'

type S = { id: string; name: string; lat: number; lng: number; status: string; diff: number | null; level: number | null; trend: number | null; areaName: string }
type H = { id: string; name: string; lat: number; lng: number; status: string; phone: string; capacity: number | null }
type C = { id: string; name: string; lat: number; lng: number; page: string }
const COLOR: Record<string, string> = { normal: '#1f9d55', watch: '#d9a400', high: '#e8590c', critical: '#c92a2a', nodata: '#868e96' }

type LK = 'stations' | 'labels' | 'shelters' | 'cams' | 'flow' | 'radar' | 'border'
const KEYS: LK[] = ['stations', 'labels', 'shelters', 'cams', 'flow', 'radar', 'border']
const NAME: Record<LK, string> = { stations: 'lyStations', labels: 'lyLabels', shelters: 'lyShelters', cams: 'lyCams', flow: 'lyFlow', radar: 'lyRadar', border: 'lyBorder' }
const DEF: Record<LK, boolean> = { stations: true, labels: true, shelters: true, cams: true, flow: true, radar: false, border: true }
const el = (tag: string, text: string, cls?: string) => { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e }

export default function MapView({ stations, cams, shelters, t }: { stations: S[]; cams: C[]; shelters: H[]; t: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState<Record<LK, boolean>>(DEF)
  const [open, setOpen] = useState(false)
  const [map, setMap] = useState<L.Map | null>(null)
  const [frames, setFrames] = useState<{ time: number; path: string }[]>([])
  const [host, setHost] = useState('')
  const [fi, setFi] = useState(-1)
  const [radarErr, setRadarErr] = useState(false)
  const onRef = useRef(on); onRef.current = on
  const apply = useRef<() => void>()
  const radar = useRef<L.TileLayer>()
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem('maplayers') || 'null'); if (v) setOn({ ...DEF, ...v }) } catch {} }, [])
  const set = (v: Record<LK, boolean>) => { setOn(v); try { localStorage.setItem('maplayers', JSON.stringify(v)) } catch {} }
  useEffect(() => {
    if (!ref.current) return
    const map = L.map(ref.current, { zoomControl: true }).setView([7.0086, 100.4747], 11)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' }).addTo(map)
    const gSt = L.layerGroup(), gCam = L.layerGroup(), gSh = L.layerGroup(), gFlow = L.layerGroup(), gBorder = L.layerGroup()
    const border: L.Layer[] = []
    const pts: L.LatLngExpression[] = []
    let labeled = 0
    for (const s of stations) {
      const box = document.createElement('div')
      box.append(el('b', s.name), el('div', s.areaName))
      box.append(el('div', `${t[s.status]}${s.diff != null ? ` · ${Math.abs(s.diff).toFixed(2)} ${t.m} ${s.diff >= 0 ? t.above : t.below}` : ''}`))
      if (s.level != null) box.append(el('div', `${t.level} ${s.level.toFixed(2)} ${t.m}`))
      const mk = L.circleMarker([s.lat, s.lng], { radius: 9, color: '#fff', weight: 2, fillColor: COLOR[s.status], fillOpacity: 0.95 }).bindPopup(box).addTo(gSt)
      if (s.status !== 'normal' && s.status !== 'nodata' && s.diff != null && ++labeled <= 6)
        mk.bindTooltip(`${Math.abs(s.diff).toFixed(2)} ${t.m} ${s.diff >= 0 ? t.above : t.below}`, { permanent: true, direction: 'right', offset: [10, 0], className: 'maplbl' })
      pts.push([s.lat, s.lng])
    }
    for (const c of cams) {
      const box = document.createElement('div')
      const a = el('a', t.openCam) as HTMLAnchorElement; a.href = c.page; a.target = '_blank'; a.rel = 'noopener noreferrer'
      box.append(el('b', c.name), document.createElement('br'), a)
      L.marker([c.lat, c.lng], { icon: L.divIcon({ html: iconSvg('camera'), className: 'camicon', iconSize: [26, 26] }) }).bindPopup(box).addTo(gCam)
    }
    for (const h of shelters) {
      const box = document.createElement('div')
      box.append(el('b', h.name), document.createElement('br'), el('span', `${t['sh_' + h.status]}${h.capacity != null ? ` · ${t.shCap} ${h.capacity}` : ''}`))
      const nav = el('a', t.shNav) as HTMLAnchorElement; nav.href = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`; nav.target = '_blank'; nav.rel = 'noopener noreferrer'
      box.append(document.createElement('br'), nav)
      if (h.phone) { const tel = el('a', ` ${t.shCall}`) as HTMLAnchorElement; tel.href = `tel:${h.phone}`; box.append(' · ', tel) }
      L.marker([h.lat, h.lng], { icon: L.divIcon({ html: iconSvg('shield'), className: 'shicon', iconSize: [26, 26] }) }).bindPopup(box).addTo(gSh)
    }
    for (const f of FLOWS) {
      const d = document.createElement('div'); d.className = 'flow'
      const lb = el('span', t[f.key], 'flb'); lb.style.background = f.color
      const ar = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ar.setAttribute('viewBox', '0 0 24 24'); ar.setAttribute('class', 'fla')
      ar.style.transform = `rotate(${f.deg}deg)`
      ar.innerHTML = `<path d="M12 2 L21 14 H15 V22 H9 V14 H3 Z" fill="${f.color}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`
      d.append(lb, ar)
      L.marker([f.lat, f.lng], { icon: L.divIcon({ html: d, className: '', iconSize: [0, 0], iconAnchor: [0, 30] }), interactive: false, keyboard: false }).addTo(gFlow)
    }
    if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [30, 30] })
    let dead = false
    const getJson = (u: string) => fetch(u).then((r) => { if (!r.ok) console.warn('[map] ไม่พบไฟล์', u, r.status); return r.ok ? r.json() : null }).catch((e) => { console.warn('[map] โหลดไม่ได้', u, e); return null })
    ;(async () => {
      const tg = await getJson('/songkhla-tambons.geojson')
      if (dead) return
      if (tg?.features) border.push(L.geoJSON(tg, { style: { color: '#7aa7d6', weight: 1, fillOpacity: 0.02 }, interactive: false }))
      const red = { color: '#e03131', weight: 3, fill: false, interactive: false }
      const draw = (outer: number[][][]) => {
        const world: L.LatLngExpression[] = [[-85, -360], [-85, 360], [85, 360], [85, -360]]
        const holes = outer.map((r) => r.map((c) => [c[1], c[0]] as L.LatLngExpression))
        border.push(L.polygon([world, ...holes], { stroke: false, fillColor: '#1b2733', fillOpacity: 0.85, interactive: false }), L.polygon(holes, red))
        gBorder.clearLayers(); border.forEach((l) => gBorder.addLayer(l)); apply.current?.()
      }
      const outerOf = (gj: any): number[][][] => {
        const out: number[][][] = []
        for (const f of gj.features ?? [gj]) {
          const g = f.geometry ?? f; if (!g) continue
          if (g.type === 'Polygon') out.push(g.coordinates[0])
          else if (g.type === 'MultiPolygon') for (const p of g.coordinates) out.push(p[0])
        }
        return out
      }
      gBorder.clearLayers(); border.forEach((l) => gBorder.addLayer(l)); apply.current?.()
      if (!tg?.features) return
      try {
        const pc: any = (await import('polygon-clipping')).default
        const geoms: any[] = []
        for (const f of tg.features) {
          const g = f.geometry; if (!g) continue
          if (g.type === 'Polygon') geoms.push(g.coordinates)
          else if (g.type === 'MultiPolygon') geoms.push(...g.coordinates)
        }
        const merged: number[][][][] = pc.union(geoms[0], ...geoms.slice(1))
        if (dead) return
        draw(merged.map((p) => p[0]))
      } catch (e) { console.warn('[map] สร้างกรอบจังหวัดไม่สำเร็จ', e) }
    })()
    apply.current = () => {
      const o = onRef.current
      const sync = (g: L.LayerGroup, v: boolean) => { if (v && !map.hasLayer(g)) g.addTo(map); if (!v && map.hasLayer(g)) map.removeLayer(g) }
      sync(gSt, o.stations); sync(gSh, o.shelters); sync(gCam, o.cams); sync(gFlow, o.flow); sync(gBorder, o.border)
      if (o.border) border.forEach((l: any) => l.bringToBack?.())
      ref.current?.classList.toggle('nolbl', !o.labels)
    }
    apply.current()
    const zc = () => { const c = map.getContainer(); c.classList.toggle('zfar', map.getZoom() < 11); c.classList.toggle('zmid', map.getZoom() < 12) }
    map.on('zoomend', zc); zc()
    setMap(map)
    return () => { dead = true; setMap(null); map.remove() }
  }, [stations, cams, shelters, t])
  useEffect(() => { apply.current?.() }, [on])
  useEffect(() => {
    if (!on.radar || frames.length) return
    fetch('https://api.rainviewer.com/public/weather-maps.json').then((r) => r.json()).then((j) => {
      const p = j?.radar?.past
      if (!Array.isArray(p) || !p.length || typeof j.host !== 'string' || !j.host.startsWith('https://')) throw 0
      setHost(j.host); setFrames(p); setFi(p.length - 1)
    }).catch(() => setRadarErr(true))
  }, [on.radar, frames.length])
  useEffect(() => {
    if (!map) return
    if (radar.current) { map.removeLayer(radar.current); radar.current = undefined }
    if (!on.radar || fi < 0 || !frames[fi]) return
    radar.current = L.tileLayer(`${host}${frames[fi].path}/256/{z}/{x}/{y}/2/1_1.png`, { opacity: 0.7, maxNativeZoom: 7, maxZoom: 18, zIndex: 300, attribution: 'Radar © <a href="https://www.rainviewer.com" target="_blank" rel="noopener noreferrer">RainViewer</a>' }).addTo(map)
  }, [map, on.radar, fi, frames, host])
  const hhmm = (ts: number) => new Date(ts * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })
  const count = KEYS.filter((k) => on[k]).length
  return (
    <div className="mapwrap">
      <div ref={ref} className="mapbox" />
      <div className="lybar">
        <button className={`lybtn${on.cams ? ' act' : ''}`} onClick={() => set({ ...on, cams: !on.cams })} aria-pressed={on.cams}><Ic n="camera" />{t.lyCams}</button>
        <button className={`lybtn${on.radar ? ' act' : ''}`} onClick={() => set({ ...on, radar: !on.radar })} aria-pressed={on.radar}><Ic n="rain" />{t.lyRadar}</button>
        <button className="lybtn" onClick={() => setOpen(!open)} aria-expanded={open}><Ic n="sliders" />{t.lyLayers} ({count})</button>
      </div>
      {open && (
        <div className="lypanel">
          <h4>{t.lyPresets}</h4>
          <div className="lypre">
            <button onClick={() => set({ ...DEF, radar: true })}>{t.lyAll}</button>
            <button onClick={() => set({ stations: true, labels: true, cams: false, flow: false, radar: false, border: true, shelters: false })}>{t.lyStOnly}</button>
            <button onClick={() => set({ stations: false, labels: false, cams: false, flow: false, radar: false, border: false, shelters: false })}>{t.lyNone}</button>
          </div>
          <h4>{t.lyLayers}</h4>
          {KEYS.map((k) => (
            <label className="lyrow" key={k}><span>{t[NAME[k]]}</span><input type="checkbox" checked={on[k]} onChange={(e) => set({ ...on, [k]: e.target.checked })} /></label>
          ))}
          {on.flow && <small>{t.lyFlowNote}</small>}
        </div>
      )}
      <div className="radbar">
      {on.radar && (radarErr ? <small>{t.lyRadarFail}</small> : frames.length > 0 && <>
            <input className="lyrange" type="range" min={0} max={frames.length - 1} value={fi} onChange={(e) => setFi(Number(e.target.value))} aria-label={t.lyRadar} />
            <small>{fi === frames.length - 1 ? t.lyLatest : ''} {frames[fi] && hhmm(frames[fi].time)} · {t.lyRadarNote}</small></>)}
      </div>
    </div>
  )
}
