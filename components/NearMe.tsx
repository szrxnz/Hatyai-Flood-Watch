'use client'
import { Ic } from '@/components/Icons'
import { FormEvent, useEffect, useState } from 'react'
import { haversineKm } from '@/lib/geo'

type S = { id: string; name: string; lat: number; lng: number; status: string; diff: number | null }
type A = { id: string; name: string; lat: number; lng: number }
type L = Record<string, string>

export default function NearMe({ stations, areas, t }: { stations: S[]; areas: A[]; t: L }) {
  const [pt, setPt] = useState<{ lat: number; lng: number } | null>(null)
  const [q, setQ] = useState('')
  const [err, setErr] = useState<'' | 'loc' | 'miss'>('')
  useEffect(() => {
    try { const a = areas.find((x) => x.id === localStorage.getItem('area')); if (a) { setPt(a); setQ(a.name) } } catch {}
  }, [areas])

  const choose = (a: A) => { setPt(a); setQ(a.name); setErr(''); try { localStorage.setItem('area', a.id) } catch {} }
  const search = (e: FormEvent) => {
    e.preventDefault()
    const s = q.trim().toLowerCase(); if (!s) return
    const a = areas.find((x) => x.name.toLowerCase().includes(s))
    a ? choose(a) : setErr('miss')
  }
  const locate = () => {
    setErr('')
    navigator.geolocation?.getCurrentPosition(
      (p) => setPt({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setErr('loc'), { timeout: 10000 })
  }
  const best = pt ? stations.map((s) => ({ s, d: haversineKm(pt, s) })).sort((a, b) => a.d - b.d)[0] : null

  return (
    <div className="card near">
      <div className="nearhead"><i className="bigic"><Ic n="pin" /></i><div><h3>{t.nearTitle}</h3><p className="muted">{t.nearSub}</p></div></div>
      <form className="search" onSubmit={search}>
        <span className="sic"><Ic n="pin" /></span>
        <input list="areas" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPh} aria-label={t.searchPh} />
        <datalist id="areas">{areas.map((a) => <option key={a.id} value={a.name} />)}</datalist>
        <button className="primary" type="submit"><Ic n="search" />{t.searchBtn}</button>
      </form>
      <div className="ex">
        <Ic n="pin" />{t.example}:
        {areas.slice(0, 3).map((a, i) => <span key={a.id}><button type="button" className="exb" onClick={() => choose(a)}>{a.name.split(' · ')[0]}</button>{i < 2 && <em>|</em>}</span>)}
        <button type="button" className="ghost" onClick={locate}><Ic n="target" />{t.locate}</button>
      </div>
      {err === 'loc' && <p className="warn">{t.locFail}</p>}
      {err === 'miss' && <p className="warn">{t.noMatch}</p>}
      {best && (
        <p className="result">{t.nearest}: <b>{best.s.name}</b> ({best.d.toFixed(1)} {t.km}){' '}
          <span className={`badge ${best.s.status}`}>{t[best.s.status]}</span></p>
      )}
      <p className="muted">{t.privacy}</p>
    </div>
  )
}
