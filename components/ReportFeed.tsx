'use client'
import { useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import type { PublicReport } from '@/lib/reports'

type T = Record<string, string>

function ago(at: number, t: T) {
  const m = Math.max(1, Math.round((Date.now() - at) / 60000))
  return m < 60 ? `${m} ${t.rfMin}` : `${Math.round(m / 60)} ${t.rfHr}`
}

export default function ReportFeed({ t }: { t: T }) {
  const [list, setList] = useState<PublicReport[] | null>(null)
  const [flagged, setFlagged] = useState<string[]>([])
  const [cnt, setCnt] = useState<Record<string, number>>({})
  const [done, setDone] = useState<string[]>([])
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<Record<string, string>>({})
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
  )
}
