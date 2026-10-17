import { notFound } from 'next/navigation'
import Link from 'next/link'
import Dashboard from '@/components/Dashboard'
import NearMe from '@/components/NearMe'
import MenuList from '@/components/MenuList'
import { Ic } from '@/components/Icons'
import { dict, isLang } from '@/lib/i18n'
import { buildAreas, getStationViews } from '@/lib/data'
import { fetchRain } from '@/lib/tmd'

export const revalidate = 600
const LINKS = [['ThaiWater', 'https://www.thaiwater.net'], ['TMD', 'https://www.tmd.go.th'], ['DDPM', 'https://www.disaster.go.th'], ['RID', 'https://www.rid.go.th']]
const TEL = [['1784', 'e1784'], ['1669', 'e1669'], ['191', 'e191'], ['199', 'e199'], ['1193', 'e1193']]

export default async function Home({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const [stations, rain] = await Promise.all([getStationViews(lang), fetchRain(7.0086, 100.4747)])
  const latest = stations.map((s) => s.at).filter(Boolean).sort().pop()
  const mins = latest ? Math.max(0, Math.round((Date.now() - Date.parse(latest)) / 60000)) : null
  const total = rain?.reduce((a, r) => a + r.mm, 0) ?? 0
  const maxP = rain ? Math.max(...rain.map((r) => r.prob)) : -1
  const maxMm = rain ? Math.max(1, ...rain.map((r) => r.mm)) : 1

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <h1>{t.title1}<em>{t.title2}</em></h1>
          <p className="tag">{t.tagline}</p>
          <p className="sub">{t.sub}</p>
          <p className="live"><span className={`dot ${mins == null || mins > 180 ? 'nodata' : mins > 60 ? 'watch' : 'normal'}`} />
            {t.updated}: {mins == null ? '-' : mins < 60 ? `${mins} ${t.ago}` : `${Math.round(mins / 60)} ${t.hrAgo}`}
            {mins != null && mins > 60 && <b> · {t.staleWarn}</b>}
            <span className="rf"><Ic n="refresh" /></span></p>
        </div>
      </header>
      <main className="wrap">
        <Dashboard stations={stations} t={t} lang={lang} now0={Date.now()}>
          <NearMe t={t} areas={buildAreas(stations)}
            stations={stations.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng, status: s.status, diff: s.diff }))} />
        </Dashboard>

        <MenuList lang={lang} t={t} />

        <h2><Ic n="rain" />{t.rain}</h2>
        <div className="card">
          {rain ? (<>
            <div className="bars" aria-hidden>{rain.map((r) => <i key={r.t} title={`${r.t.slice(11, 16)} · ${r.mm} mm`} style={{ height: `${Math.max(3, (r.mm / maxMm) * 100)}%`, opacity: r.prob < 0 ? 0.8 : 0.35 + r.prob / 160 }} />)}</div>
            <div className="axis muted" aria-hidden>{[0, 6, 12, 18, 23].map((i) => <span key={i}>{rain[i]?.t.slice(11, 16)}</span>)}</div>
            <p className="big">{total.toFixed(1)} <small>{t.mm}{maxP >= 0 ? ` · ${t.maxProb} ${maxP}%` : ''}</small></p>
          </>) : <p className="warn">{t.rainFail}</p>}
        </div>

        <h2><Ic n="phone" />{t.emergency}</h2>
        <div className="tels">{TEL.map(([n, k]) => <a key={n} className="tel" href={`tel:${n}`}><b>{n}</b><span>{t[k]}</span></a>)}</div>

        <h2>{t.sources}</h2>
        <p>{LINKS.map(([n, u]) => <a key={n} className="src" href={u} rel="noopener noreferrer" target="_blank">{n}<Ic n="ext" /></a>)}</p>
        <footer>{t.liveNote}<br />{t.disclaimer}<br /><Link className="link" href={`/${lang}/admin`}>{t.staffLink}</Link></footer>
      </main>
    </>
  )
}
