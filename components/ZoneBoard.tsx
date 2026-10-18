'use client'
import { useMemo, useState } from 'react'
import { Ic } from '@/components/Icons'
import type { FlagLevel } from '@/lib/zoneFlags'

type Item = { slug: string; name: string; muni: string; communities: string[]; level: FlagLevel; banner: string | null; url: string }
type Labels = { search: string; empty: string; open: string; banner: string; fail: string; n: string; match: string; level: Record<FlagLevel, string> }

export default function ZoneBoard({ items, L }: { items: Item[]; L: Labels }) {
  const [q, setQ] = useState('')
  const key = q.trim().toLowerCase()
  const rows = useMemo(() => items.flatMap((g) => {
    if (!key) return [{ g, hits: [] as string[] }]
    const hits = g.communities.filter((c) => c.toLowerCase().includes(key))
    return hits.length || g.name.toLowerCase().includes(key) || g.muni.toLowerCase().includes(key) ? [{ g, hits }] : []
  }), [items, key])
  return (
    <div className="zb">
      <div className="zin near"><div className="search"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.search} aria-label={L.search} /></div></div>
      {rows.length === 0 && <div className="card"><b>{L.empty}</b></div>}
      {rows.map(({ g, hits }) => (
        <div key={g.slug} className={`card st ${g.level}`}>
          <div className="row"><b>{g.name}</b><span className={`badge ${g.level}`}>{L.level[g.level]}</span></div>
          <div className="muted">{g.muni} · {L.n.replace('{n}', String(g.communities.length))}</div>
          {hits.length > 0 && <p className="zhit">{L.match}: {hits.join(', ')}</p>}
          {g.level === 'nodata' && <p className="muted">{L.fail}</p>}
          {g.banner && (
            <details open={g.level !== 'normal'}>
              <summary>{L.banner}</summary>
              <img src={g.banner} alt={`${g.name}: ${L.level[g.level]}`} loading="lazy" style={{ width: '100%', borderRadius: 10, marginTop: 8 }} />
            </details>
          )}
          <details>
            <summary>{L.n.replace('{n}', String(g.communities.length))}</summary>
            <p className="muted">{g.communities.join(', ')}</p>
          </details>
          <a className="src" href={g.url} target="_blank" rel="noopener noreferrer">{L.open}<Ic n="ext" /></a>
        </div>
      ))}
    </div>
  )
}
