'use client'
import { Ic } from '@/components/Icons'
import Link from 'next/link'
import { ReactNode, useEffect, useMemo, useState } from 'react'

type V = { id: string; name: string; river: string; level: number | null; diff: number | null; trend: number | null; status: string; at: string | null; areaName: string; amphoe: string }
type L = Record<string, string>
const CHIPIC = ['pin', 'rain', 'mountain', 'tree', 'wave', 'building', 'drop']
const ORDER = ['critical', 'high', 'watch', 'normal']
const ICON: Record<string, string> = { critical: 'wave', high: 'home', watch: 'alert', normal: 'check' }
const RANK: Record<string, number> = { critical: 0, high: 1, watch: 2, normal: 3, nodata: 4 }

export function Trend({ v, t }: { v: number | null; t: L }) {
  if (v == null) return null
  if (v > 0.01) return <span className="tr up"><Ic n="up" />{t.rising} +{v.toFixed(2)}</span>
  if (v < -0.01) return <span className="tr down"><Ic n="down" />{t.falling} {v.toFixed(2)}</span>
  return <span className="tr"><Ic n="flat" />{t.steady}</span>
}

export default function Dashboard({ stations, t, lang, now0, children }: { stations: V[]; t: L; lang: string; now0: number; children?: ReactNode }) {
  const [now, setNow] = useState(now0)
  const [amphoe, setAmphoe] = useState('all')
  const [status, setStatus] = useState<string | null>(null)
  const [limit, setLimit] = useState(8)
  useEffect(() => {
    setNow(Date.now())
    try { const a = localStorage.getItem('amphoe'); if (a) setAmphoe(a) } catch {}
  }, [])
  const amphoes = useMemo(() => [...new Set(stations.map((s) => s.amphoe))].sort((a, b) => a.localeCompare(b)), [stations])
  const wl = useMemo(() => {
    const m = new Map<string, { a: string; worst: string; n: number }>()
    for (const s of stations) {
      const e = m.get(s.amphoe) ?? { a: s.amphoe, worst: 'nodata', n: 0 }
      if (RANK[s.status] < RANK[e.worst]) e.worst = s.status
      e.n++; m.set(s.amphoe, e)
    }
    return [...m.values()].sort((a, b) => RANK[a.worst] - RANK[b.worst] || b.n - a.n).slice(0, 6)
  }, [stations])
  const inArea = stations.filter((s) => amphoe === 'all' || s.amphoe === amphoe)
  const shown = inArea.filter((s) => !status || s.status === status)
  const count = (l: string) => inArea.filter((s) => s.status === l).length
  const nodata = inArea.filter((s) => s.status === 'nodata').length
  const ago = (iso: string | null) => {
    if (!iso) return '-'
    const m = Math.max(0, Math.round((now - Date.parse(iso)) / 60000))
    return m < 60 ? `${m} ${t.ago}` : `${Math.round(m / 60)} ${t.hrAgo}`
  }
  const pickArea = (a: string) => { setAmphoe(a); setLimit(8); try { localStorage.setItem('amphoe', a) } catch {} }

  const card = (s: V) => {
    const pct = s.diff == null ? 0 : Math.min(100, Math.max(0, ((s.diff + 2) / 2) * 100))
    return (
      <div className={`card st ${s.status}`} key={s.id}>
        <div className="row"><b>{s.name}</b><span className={`badge ${s.status}`}>{t[s.status]}</span></div>
        <div className="muted">{[s.river, s.areaName].filter(Boolean).join(' · ')}</div>
        {s.level != null && s.diff != null ? (<>
          <div className="big">{Math.abs(s.diff).toFixed(2)} <small>{t.m} {s.diff >= 0 ? t.above : t.below}</small></div>
          <div className="meter" aria-hidden><i className={s.status} style={{ width: `${pct}%` }} /></div>
          <div className="muted row"><span>{t.level} {s.level.toFixed(2)} {t.m} <Trend v={s.trend} t={t} /></span><span>{ago(s.at)}</span></div>
        </>) : <div className="muted">{t.nodata} · {ago(s.at)}</div>}
      </div>
    )
  }

  const pre = lang === 'th' ? 'อ.' : ''
  const keyCard = (s: V) => (
    <div className={`card kc ${s.status}x`} key={s.id}>
      <i className="kic"><Ic n="wave" /></i>
      <b className="kn">{s.name}</b>
      <div className="kl">{s.level != null ? <>{s.level.toFixed(2)} <small>{t.m}</small></> : '-'}</div>
      <span className={`badge ${s.status}`}>{t[s.status]}</span>
      <small className="muted">{t.updated} {ago(s.at)}</small>
    </div>
  )

  return (
    <>
      <div className="chips">
        {['all', ...amphoes].map((a, i) => (
          <button key={a} className={`chip ${amphoe === a ? 'on' : ''}`} onClick={() => pickArea(a)}><Ic n={a === 'all' ? 'home' : CHIPIC[i % CHIPIC.length]} />{a === 'all' ? t.all : a}</button>
        ))}
      </div>

      <div className="tiles">
        {ORDER.map((l) => (
          <button key={l} className={`tile ${l} ${status === l ? 'sel' : ''} ${status && status !== l ? 'dim' : ''}`}
            onClick={() => { setStatus(status === l ? null : l); setLimit(8) }} aria-pressed={status === l}>
            <i><Ic n={ICON[l]} /></i><b>{count(l)}</b><strong>{t[l]}</strong><span>{t['d_' + l]}</span>
          </button>
        ))}
      </div>
      <p className="muted hint">{t.hint}{nodata > 0 && ` · ${t.nodata}: ${nodata}`}</p>

      <div className="grid2">
        {children}
        <Link className="mapcard" href={`/${lang}/map`}>
          <span className="mpill"><Ic n="alert" /><b>{t.mapPill}</b><em>›</em></span>
        </Link>
      </div>

      <div className="row2">
        <section>
          <div className="row"><h2><Ic n="drop" />{t.keyAreas}</h2><Link className="link" href={`/${lang}/updates`}>{t.viewAll}<Ic n="arrow" /></Link></div>
          <div className="keys">{shown.slice(0, 4).map(keyCard)}</div>
          {shown.length === 0 && <p className="muted">{t.empty}</p>}
        </section>
        <section>
          <h2><Ic n="eye" />{t.watchlist}</h2>
          <div className="card wl">
            {wl.map((w) => (
              <button key={w.a} className="wlrow" onClick={() => pickArea(w.a)}>
                <span className="wn"><i className={`pdot ${w.worst}`}><Ic n="pin" /></i>{pre}{w.a}</span>
                <span className={`badge ${w.worst}`}>{t[w.worst]}</span><em>›</em>
              </button>
            ))}
          </div>
        </section>
      </div>

      {shown.length > 4 && <>
        <h2>{t.allStations}</h2>
        <div className="list">{shown.slice(4, 4 + limit).map(card)}</div>
        {shown.length > 4 + limit && <button className="more" onClick={() => setLimit(limit + 20)}>{t.more} ({shown.length - 4 - limit})</button>}
      </>}
    </>
  )
}
