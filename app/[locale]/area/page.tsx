import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import { dict, isLang } from '@/lib/i18n'
import { getStationViews } from '@/lib/data'

export const revalidate = 600
const RANK: Record<string, number> = { critical: 0, high: 1, watch: 2, normal: 3, nodata: 4 }

export default async function Area({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const views = await getStationViews(lang)
  const tam = new Map<string, { name: string; amphoe: string; worst: string; n: number }>()
  for (const s of views) {
    const a = tam.get(s.areaKey) ?? { name: s.areaName.split(' · ')[0], amphoe: s.amphoe, worst: 'nodata', n: 0 }
    if (RANK[s.status] < RANK[a.worst]) a.worst = s.status
    a.n++; tam.set(s.areaKey, a)
  }
  const byAmphoe = new Map<string, { name: string; worst: string; n: number }[]>()
  for (const a of tam.values()) byAmphoe.set(a.amphoe, [...(byAmphoe.get(a.amphoe) ?? []), a])
  const groups = [...byAmphoe.entries()].map(([amphoe, list]) => ({
    amphoe, worst: list.reduce((w, x) => (RANK[x.worst] < RANK[w] ? x.worst : w), 'nodata'),
    list: list.sort((a, b) => RANK[a.worst] - RANK[b.worst] || a.name.localeCompare(b.name)),
  })).sort((a, b) => RANK[a.worst] - RANK[b.worst] || a.amphoe.localeCompare(b.amphoe))
  return (
    <main className="wrap page">
      <h1><Ic n="pin" />{t.areaTitle}</h1>
      <p className="muted">{t.areaSub}</p>
      {groups.map((g) => (
        <section key={g.amphoe} className="areag">
          <div className="row"><h2>{g.amphoe}</h2><span className={`badge ${g.worst}`}>{t[g.worst]}</span></div>
          <div className="areas">
            {g.list.map((a) => (
              <div key={a.name} className={`card arow ${a.worst}`}>
                <span><b>{a.name}</b> <small className="muted">· {a.n} {t.areaSt}</small></span>
                <span className={`badge ${a.worst}`}>{t[a.worst]}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
