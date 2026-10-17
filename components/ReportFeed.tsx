'use client'
<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'
import { Ic } from '@/components/Icons'
import ZoneFilter from '@/components/ZoneFilter'
import { haversineKm } from '@/lib/geo'
import { NO_ZONE, useZones, zoneLabel, zoneOf, type ZoneSel } from '@/lib/zones'
import type { Lang } from '@/lib/types'
=======
import { useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
import type { PublicReport } from '@/lib/reports'

type T = Record<string, string>

function ago(at: number, t: T) {
  const m = Math.max(1, Math.round((Date.now() - at) / 60000))
  return m < 60 ? `${m} ${t.rfMin}` : `${Math.round(m / 60)} ${t.rfHr}`
}

<<<<<<< HEAD
export default function ReportFeed({ t, lang }: { t: T; lang: Lang }) {
=======
export default function ReportFeed({ t }: { t: T }) {
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
  const [list, setList] = useState<PublicReport[] | null>(null)
  const [flagged, setFlagged] = useState<string[]>([])
  const [cnt, setCnt] = useState<Record<string, number>>({})
  const [done, setDone] = useState<string[]>([])
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<Record<string, string>>({})
<<<<<<< HEAD
  const zones = useZones()
  const [sel, setSel] = useState<ZoneSel>(NO_ZONE)
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null)
=======
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
  const say = (id: string, m: string) => setMsg((x) => ({ ...x, [id]: m }))
  useEffect(() => {
    const go = () => fetch('/api/report').then((r) => (r.ok ? r.json() : [])).then(setList).catch(() => setList([]))
    go()
    const id = setInterval(go, 60000)
    return () => clearInterval(id)
  }, [])
  const flag = async (id: string) => {
    if (!confirm(t.rfConfirm)) return
    setFlagged((f) => [...f, id])
    fetch('/api/report', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => {})
  }
  const confirmOk = (id: string) => {
    if (!navigator.geolocation) { say(id, t.rpNoLoc); return }
    setBusy(id); say(id, t.rfOkLoc)
    navigator.geolocation.getCurrentPosition(async (p) => {
      try {
        const r = await fetch('/api/report', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, act: 'confirm', lat: p.coords.latitude, lng: p.coords.longitude }) })
        if (r.ok) { const j = await r.json(); setCnt((c) => ({ ...c, [id]: j.n })); setDone((d) => [...d, id]); say(id, '') }
        else say(id, r.status === 403 ? t.rfOkFar : r.status === 409 ? t.rfOkOwn : r.status === 429 ? t.rpRate : t.rfOkFail)
      } catch { say(id, t.rfOkFail) }
      setBusy('')
    }, () => { setBusy(''); say(id, t.rpNoLoc) }, { enableHighAccuracy: true, timeout: 15000 })
  }
<<<<<<< HEAD
  // คำนวณตำบล/อำเภอของแต่ละรายงานจากพิกัดที่ปัก
  const zoneById = useMemo(() => {
    const m = new Map<string, ZoneSel>()
    if (zones && list) for (const r of list) { const z = zoneOf(zones, r.lat, r.lng); if (z) m.set(r.id, { ac: z.ac, tc: z.tc }) }
    return m
  }, [zones, list])
  const counts = useMemo(() => {
    const a: Record<string, number> = { '': list?.length ?? 0 }, tc: Record<string, number> = {}
    zoneById.forEach((z) => { a[z.ac] = (a[z.ac] ?? 0) + 1; tc[z.tc] = (tc[z.tc] ?? 0) + 1 })
    return { a, t: tc }
  }, [zoneById, list])
  const shown = useMemo(() => {
    let v = (list ?? []).filter((r) => {
      if (!sel.ac) return true
      const z = zoneById.get(r.id)
      return !!z && z.ac === sel.ac && (!sel.tc || z.tc === sel.tc)
    })
    if (me) v = [...v].sort((a, b) => haversineKm(me, a) - haversineKm(me, b))
    return v
  }, [list, sel, zoneById, me])

  if (!list) return <div className="card">{t.loading}</div>
  return (
    <>
      <ZoneFilter zones={zones} sel={sel} onSel={setSel} counts={counts} onMe={setMe} t={t} lang={lang} />
      <p className="muted zcount">{t.zoShowing.replace('{n}', String(shown.length))}</p>
      {!shown.length && <div className="card"><p className="muted">{list.length ? t.zoRpEmpty : t.rfEmpty}</p></div>}
      <div className="rfgrid rf2">
            {shown.map((r) => (
              <article key={r.id} id={`rp-${r.id}`} className="card rfc">
                <img src={`/api/report?id=${r.id}`} alt="" loading="lazy" />
                <div className="row"><small className="muted"><Ic n="clock" />{ago(r.at, t)}</small>
                  <a className="link" href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noopener noreferrer"><Ic n="pin" />{t.rfMap}</a></div>
                {zones && <small className="zlab"><Ic n="pin" />{zoneById.has(r.id) ? zoneLabel(zones, zoneById.get(r.id)!, lang) : t.zoNoZone}{me && ` · ${t.zoAway.replace('{d}', haversineKm(me, r).toFixed(1))}`}</small>}
                {r.note && <p>{r.note}</p>}
                {(() => { const n = cnt[r.id] ?? r.ok; return <span className={`okb${n >= 3 ? ' strong' : ''}`}><Ic n="check" />{n > 0 ? t.rfOkN.replace('{n}', String(n)) : t.rfOkNone}</span> })()}
                {msg[r.id] && <small className="muted">{msg[r.id]}</small>}
                <div className="acts">
                  <button className="ghost" disabled={done.includes(r.id) || busy === r.id} onClick={() => confirmOk(r.id)}><Ic n="check" />{done.includes(r.id) ? t.rfOkDone : t.rfOk}</button>
                  <button className="ghost" disabled={flagged.includes(r.id)} onClick={() => flag(r.id)}><Ic n="alert" />{flagged.includes(r.id) ? t.rfFlagged : t.rfFlag}</button>
                </div>
              </article>
            ))}
      </div>
    </>
=======
  if (!list) return <div className="card">{t.loading}</div>
  if (!list.length) return <div className="card"><p className="muted">{t.rfEmpty}</p></div>
  return (
    <div className="rfgrid">
      {list.map((r) => (
        <article key={r.id} className="card rfc">
          <img src={`/api/report?id=${r.id}`} alt="" loading="lazy" />
          <div className="row"><small className="muted"><Ic n="clock" />{ago(r.at, t)}</small>
            <a className="link" href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noopener noreferrer"><Ic n="pin" />{t.rfMap}</a></div>
          {r.note && <p>{r.note}</p>}
          {(() => { const n = cnt[r.id] ?? r.ok; return <span className={`okb${n >= 3 ? ' strong' : ''}`}><Ic n="check" />{n > 0 ? t.rfOkN.replace('{n}', String(n)) : t.rfOkNone}</span> })()}
          {msg[r.id] && <small className="muted">{msg[r.id]}</small>}
          <div className="acts">
            <button className="ghost" disabled={done.includes(r.id) || busy === r.id} onClick={() => confirmOk(r.id)}><Ic n="check" />{done.includes(r.id) ? t.rfOkDone : t.rfOk}</button>
            <button className="ghost" disabled={flagged.includes(r.id)} onClick={() => flag(r.id)}><Ic n="alert" />{flagged.includes(r.id) ? t.rfFlagged : t.rfFlag}</button>
          </div>
        </article>
      ))}
    </div>
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
  )
}
