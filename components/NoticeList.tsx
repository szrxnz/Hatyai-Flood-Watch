'use client'
import { useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import type { Notice } from '@/lib/store'

type T = Record<string, string>
const RANK: Record<string, number> = { info: 0, watch: 1, high: 2, critical: 3 }

export function useNotices() {
  const [list, setList] = useState<Notice[] | null>(null)
  useEffect(() => {
    const go = () => fetch('/api/notices').then((r) => (r.ok ? r.json() : [])).then(setList).catch(() => setList([]))
    go()
    const id = setInterval(go, 120000)
    return () => clearInterval(id)
  }, [])
  return list
}

export function NoticeBar({ lang, t }: { lang: string; t: T }) {
  const list = useNotices()
  if (!list?.length) return null
  const sorted = [...list].sort((a, b) => RANK[b.level] - RANK[a.level] || b.at - a.at)
  const items = sorted.map((n) => `${n.title}${n.body ? ' - ' + n.body : ''}`.replace(/\s+/g, ' '))
  const dur = Math.max(20, items.join('').length * 0.22)
  const row = (k: string) => (
    <span className="tkrow" key={k} aria-hidden={k === 'b'}>
      {sorted.map((n, i) => <a key={n.id} href={`/${lang}/notices#${n.id}`}>{items[i]}</a>)}
    </span>
  )
  return (
    <div className={`nbar lv-${sorted[0].level}`} role="marquee" aria-label={t.ntTitle}>
      <Ic n="alert" />
      <div className="tk"><div className="tkin" style={{ animationDuration: `${dur}s` }}>{row('a')}{row('b')}</div></div>
    </div>
  )
}

export default function NoticeList({ lang, t }: { lang: string; t: T }) {
  const list = useNotices()
  const [done, setDone] = useState('')
  const share = async (n: Notice) => {
    const url = `${location.origin}/${lang}/notices#${n.id}`
    try {
      if (navigator.share) await navigator.share({ title: n.title, text: n.title, url })
      else { await navigator.clipboard.writeText(url); setDone(n.id); setTimeout(() => setDone(''), 2000) }
    } catch {}
  }
  if (!list) return <div className="card">{t.loading}</div>
  if (!list.length) return <div className="card"><p className="muted">{t.ntEmpty}</p></div>
  return (
    <>
      {list.map((n) => (
        <article key={n.id} id={n.id} className={`card ntc lv-${n.level}`}>
          <div className="row"><span className="ntk">{t[`kind_${n.kind}`]} · {t[`lv_${n.level}`]}</span>
            <button className="ghost" onClick={() => share(n)}><Ic n="share" />{done === n.id ? t.ntCopied : t.ntShare}</button></div>
          <h3>{n.title}</h3>
          {n.body && <p>{n.body}</p>}
          <small className="muted">{n.areas.length ? n.areas.join(', ') : t.ntAllArea} · {new Date(n.at).toLocaleString(lang === 'th' ? 'th-TH' : lang === 'zh' ? 'zh-CN' : 'en-GB', { timeZone: 'Asia/Bangkok' })}</small>
        </article>
      ))}
    </>
  )
}
