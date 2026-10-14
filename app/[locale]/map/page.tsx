import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import MapLoader from '@/components/MapLoader'
import { CAM_SITE, getCams } from '@/lib/cctv'
import { dict, isLang } from '@/lib/i18n'
import { getShelters } from '@/lib/shelters'
import { getStationViews } from '@/lib/data'

export const revalidate = 60
const LV = ['critical', 'high', 'watch', 'normal', 'nodata']

export default async function MapPage({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const stations = await getStationViews(lang)
  const cams = (await getCams()).filter((c) => c.lat != null && c.lng != null && !c.radar && !c.offline).map((c) => ({ id: c.id, name: c.name, lat: c.lat!, lng: c.lng!, page: CAM_SITE }))
  const shelters = (await getShelters()).filter((h) => h.lat != null && h.lng != null).map((h) => ({ id: h.id, name: h.name, lat: h.lat!, lng: h.lng!, status: h.status, phone: h.phone, capacity: h.capacity }))
  return (
    <main className="wrap page">
      <h1><Ic n="map" />{t.mapTitle}</h1>
      <p className="muted">{t.mapSub}</p>
      <div className="legend">{LV.map((l) => <span key={l}><i className={l} />{t[l]}</span>)}{cams.length > 0 && <span><Ic n="camera" />{t.camsOnMap}</span>}</div>
      <MapLoader t={t} cams={cams} shelters={shelters} stations={stations.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng, status: s.status, diff: s.diff, level: s.level, trend: s.trend, areaName: s.areaName }))} />
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
