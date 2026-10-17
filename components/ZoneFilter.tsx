'use client'
import { FormEvent, useState } from 'react'
import { Ic } from '@/components/Icons'
import { amphoeName, tambonName, zoneLabel, zoneOf, type ZoneSel, type Zones } from '@/lib/zones'
import type { Lang } from '@/lib/types'

type L = Record<string, string>
export interface ZoneCounts { a: Record<string, number>; t: Record<string, number> }

export default function ZoneFilter({ zones, sel, onSel, counts, onMe, t, lang }: {
  zones: Zones | null; sel: ZoneSel; onSel: (s: ZoneSel) => void; counts: ZoneCounts
  onMe: (p: { lat: number; lng: number } | null) => void; t: L; lang: Lang
}) {
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState<{ k: 'ok' | 'warn'; s: string } | null>(null)
  const [busy, setBusy] = useState(false)
  if (!zones) return <div className="card zf"><p className="muted">{t.loading}</p></div>

  const amphoes = [...zones.amphoes].sort((a, b) => (counts.a[b.code] ?? 0) - (counts.a[a.code] ?? 0) || a.th.localeCompare(b.th, 'th'))
  const cur = sel.ac ? zones.amphoeByCode.get(sel.ac) : null
  const tambons = cur ? [...cur.tambons].sort((a, b) => (counts.t[b.code] ?? 0) - (counts.t[a.code] ?? 0) || a.th.localeCompare(b.th, 'th')) : []

  const pick = (s: ZoneSel) => { setMsg(null); onMe(null); setQ(''); onSel(s) }
  const opts = [
    ...zones.amphoes.map((a) => ({ v: lang === 'th' ? `อ.${a.th}` : a.en, s: { ac: a.code, tc: '' } })),
    ...zones.tambons.map((x) => ({ v: zoneLabel(zones, { ac: x.ac, tc: x.code }, lang), s: { ac: x.ac, tc: x.code } })),
  ]
  const search = (e: FormEvent) => {
    e.preventDefault()
    const s = q.trim().toLowerCase(); if (!s) return
    const hit = opts.find((o) => o.v.toLowerCase() === s) ?? opts.find((o) => o.v.toLowerCase().includes(s.replace(/^(ต\.|อ\.|ตำบล|อำเภอ)/, '')))
    if (hit) { pick(hit.s); setQ(hit.v) } else setMsg({ k: 'warn', s: t.noMatch })
  }
  const locate = () => {
    if (!navigator.geolocation) { setMsg({ k: 'warn', s: t.locFail }); return }
    setBusy(true); setMsg(null)
    navigator.geolocation.getCurrentPosition((p) => {
      setBusy(false)
      const me = { lat: p.coords.latitude, lng: p.coords.longitude }
      const z = zoneOf(zones, me.lat, me.lng)
      onMe(me)
      if (!z) { onSel({ ac: '', tc: '' }); setMsg({ k: 'warn', s: t.zoOut }); return }
      onSel({ ac: z.ac, tc: z.tc }); setQ('')
      setMsg({ k: 'ok', s: t.zoYouAre.replace('{z}', zoneLabel(zones, z, lang)) })
    }, () => { setBusy(false); setMsg({ k: 'warn', s: t.locFail }) }, { enableHighAccuracy: true, timeout: 12000 })
  }
  const chipN = (n: number | undefined) => <small>{n ?? 0}</small>

  return (
    <div className="card zf">
      <form className="zsearch" onSubmit={search}>
        <div className="zin"><span className="sic"><Ic n="search" /></span>
          <input list="zopts" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.zoSearchPh} aria-label={t.zoSearchPh} />
          <datalist id="zopts">{opts.map((o) => <option key={o.v} value={o.v} />)}</datalist>
        </div>
        <button className="primary" type="submit"><Ic n="search" />{t.searchBtn}</button>
        <button className="ghost" type="button" disabled={busy} onClick={locate}><Ic n="target" />{busy ? t.rpLocating : t.zoNear}</button>
      </form>
      {msg && <p className={msg.k === 'ok' ? 'zmsg' : 'warn'}>{msg.s}</p>}

      <p className="zl">{t.zoAmphoe}</p>
      <div className="chips">
        <button type="button" className={!sel.ac ? 'on' : ''} onClick={() => pick({ ac: '', tc: '' })}>{t.zoAllAmphoe}{chipN(counts.a[''])}</button>
        {amphoes.map((a) => (
          <button type="button" key={a.code} className={`${sel.ac === a.code ? 'on' : ''}${(counts.a[a.code] ?? 0) === 0 ? ' z0' : ''}`}
            onClick={() => pick({ ac: a.code, tc: '' })}>{amphoeName(a, lang)}{chipN(counts.a[a.code])}</button>
        ))}
      </div>

      {cur && (
        <>
          <p className="zl">{t.zoTambon} · {amphoeName(cur, lang)}</p>
          <div className="chips">
            <button type="button" className={!sel.tc ? 'on' : ''} onClick={() => pick({ ac: cur.code, tc: '' })}>{t.zoWholeAmphoe}{chipN(counts.a[cur.code])}</button>
            {tambons.map((x) => (
              <button type="button" key={x.code} className={`${sel.tc === x.code ? 'on' : ''}${(counts.t[x.code] ?? 0) === 0 ? ' z0' : ''}`}
                onClick={() => pick({ ac: cur.code, tc: x.code })}>{tambonName(x, lang)}{chipN(counts.t[x.code])}</button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
