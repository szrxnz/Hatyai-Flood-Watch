'use client'
import { useMemo, useState } from 'react'
import { Ic } from '@/components/Icons'
import ZoneFilter from '@/components/ZoneFilter'
import { haversineKm } from '@/lib/geo'
import { amphoeFromText, NO_ZONE, useZones, zoneLabel, zoneOf, type ZoneSel } from '@/lib/zones'
import type { Lang } from '@/lib/types'
import type { Shelter } from '@/lib/shelters'

type T = Record<string, string>

export default function ShelterList({ all, t, lang }: { all: Shelter[]; t: T; lang: Lang }) {
  const zones = useZones()
  const [sel, setSel] = useState<ZoneSel>(NO_ZONE)
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null)

  // หาโซนจากพิกัดที่ปัก ถ้าไม่มีพิกัดใช้ชื่ออำเภอที่แอดมินพิมพ์ไว้ (ระบุได้แค่ระดับอำเภอ)
  const zoneById = useMemo(() => {
    const m = new Map<string, ZoneSel>()
    if (!zones) return m
    for (const s of all) {
      const z = s.lat != null && s.lng != null ? zoneOf(zones, s.lat, s.lng) : null
      if (z) m.set(s.id, { ac: z.ac, tc: z.tc })
      else { const ac = amphoeFromText(zones, s.amphoe); if (ac) m.set(s.id, { ac, tc: '' }) }
    }
    return m
  }, [zones, all])
  const counts = useMemo(() => {
    const a: Record<string, number> = { '': all.length }, tc: Record<string, number> = {}
    zoneById.forEach((z) => { a[z.ac] = (a[z.ac] ?? 0) + 1; if (z.tc) tc[z.tc] = (tc[z.tc] ?? 0) + 1 })
    return { a, t: tc }
  }, [zoneById, all])
  const shown = useMemo(() => {
    let v = all.filter((s) => {
      if (!sel.ac) return true
      const z = zoneById.get(s.id)
      return !!z && z.ac === sel.ac && (!sel.tc || z.tc === sel.tc)
    })
    const d = (s: Shelter) => (me && s.lat != null && s.lng != null ? haversineKm(me, { lat: s.lat, lng: s.lng }) : Infinity)
    if (me) v = [...v].sort((a, b) => d(a) - d(b))
    return v
  }, [all, sel, zoneById, me])

  return (
    <>
      <ZoneFilter zones={zones} sel={sel} onSel={setSel} counts={counts} onMe={setMe} t={t} lang={lang} />
      <p className="muted zcount">{t.zoShowing.replace('{n}', String(shown.length))}</p>
          {shown.length === 0 && <div className="card"><b>{all.length ? t.zoShEmpty : t.shEmpty}</b>{!all.length && <p className="muted">{t.shEmptyHow}</p>}</div>}
          <div className="feed">
            {shown.map((s) => (
              <div key={s.id} className="card shcard">
                <div className="row"><b>{s.name}</b><span className={`badge ${s.status === 'open' ? 'normal' : s.status === 'full' ? 'watch' : 'nodata'}`}>{t['sh_' + s.status]}</span></div>
                <p className="muted">{[s.amphoe, s.address].filter(Boolean).join(' · ')}{s.capacity != null && ` · ${t.shCap} ${s.capacity}`}</p>
                {zones && <small className="zlab"><Ic n="pin" />{zoneById.has(s.id) ? zoneLabel(zones, zoneById.get(s.id)!, lang) : t.zoNoZone}
                  {me && s.lat != null && s.lng != null && ` · ${t.zoAway.replace('{d}', haversineKm(me, { lat: s.lat, lng: s.lng }).toFixed(1))}`}</small>}
                {s.photos.length > 0 && (
                  <div className="shphotos">
                    {s.photos.map((ph) => <a key={ph} href={`/api/shelters/photo?id=${ph}`} target="_blank" rel="noopener noreferrer"><img src={`/api/shelters/photo?id=${ph}`} alt={s.name} loading="lazy" /></a>)}
                  </div>
                )}
                <div className="acts">
                  {s.phone && <a className="src" href={`tel:${s.phone}`}><Ic n="phone" />{t.shCall}</a>}
                  {s.lat != null && s.lng != null && <a className="src" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}><Ic n="compass" />{t.shNav}</a>}
                </div>
              </div>
            ))}
      </div>
    </>
  )
}
