import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import { FC_AREAS, fetchDaily, fetchRain } from '@/lib/tmd'
import { dict, isLang } from '@/lib/i18n'

export const revalidate = 900
const wc = (c: number): [string, string] =>
  c === 0 ? ['sun', 'wcClear'] : c <= 3 ? ['cloud', 'wcCloud'] : c <= 48 ? ['fog', 'wcFog'] : c <= 57 ? ['rain', 'wcDrizzle'] : c <= 67 ? ['rain', 'wcRain']
  : c <= 77 ? ['rain', 'wcRain'] : c <= 82 ? ['storm', 'wcShower'] : ['storm', 'wcStorm']

export default async function Forecast({ params, searchParams }: { params: { locale: string }; searchParams: { a?: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const area = FC_AREAS.find((x) => x.k === searchParams.a) ?? FC_AREAS[0]
  const [days, hours] = await Promise.all([fetchDaily(area.lat, area.lng), fetchRain(area.lat, area.lng)])
  const dn = (s: string) => new Date(s + 'T12:00:00+07:00').toLocaleDateString(lang === 'th' ? 'th-TH' : lang === 'zh' ? 'zh-CN' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const total = days?.reduce((a, d) => a + d.mm, 0) ?? 0
  const max = Math.max(1, ...(hours ?? []).map((h) => h.mm))
  return (
    <main className="wrap page">
      <h1><Ic n="rain" />{t.fcTitle}</h1>
      <p className="muted">{t.fcSub}</p>
      {(['hy', 'sk'] as const).map((g) => <div key={g}><small className="muted">{g === 'hy' ? t.fcGHy : t.fcGSk}</small>
        <div className="chips">{FC_AREAS.filter((x) => x.g === g).map((x) => <Link key={x.k} href={`/${lang}/forecast?a=${x.k}`} className={`chip${x.k === area.k ? ' on' : ''}`}>{x[lang]}</Link>)}</div></div>)}
      {!days ? <div className="card"><b>{t.fcFail}</b></div> : <>
        <div className="card fcnow">
          <div className="fcbig"><Ic n={wc(days[0].code)[0]} /></div>
          <div><b>{area[lang]} · {t[wc(days[0].code)[1]]}</b>
            <div className="muted">{Math.round(days[0].min)}–{Math.round(days[0].max)}°C · {days[0].prob >= 0 ? `${t.fcProb} ${days[0].prob}% · ` : ''}{days[0].mm.toFixed(1)} mm</div>
            <div className="muted">{t.fcRainTotal}: <b>{total.toFixed(0)} mm</b></div></div>
        </div>
        <h2>{t.fc7}</h2>
        <div className="fcdays">{days.map((d) => { const [ic, k] = wc(d.code); return (
          <div className="card fcday" key={d.d}>
            <b>{dn(d.d)}</b><span className="fcic"><Ic n={ic} /></span><small>{t[k]}</small>
            <span>{Math.round(d.min)}–{Math.round(d.max)}°C</span>
            <span className="muted"><Ic n="drop" />{d.mm.toFixed(1)} mm{d.prob >= 0 ? ` · ${d.prob}%` : ''}</span>
            <span className="muted">{t.fcWind} {Math.round(d.wind)} km/h</span>
          </div>) })}</div>
      </>}
      {hours && <><h2>{t.rain}</h2><div className="card"><div className="fchrs">{hours.map((h) => (
        <div key={h.t} title={`${h.t.slice(11, 16)} · ${h.mm} mm${h.prob >= 0 ? ` · ${h.prob}%` : ''}`}>
          <i style={{ height: `${Math.max(4, (h.mm / max) * 70)}px`, opacity: h.prob < 0 ? 0.8 : 0.35 + h.prob / 160 }} /><small>{h.t.slice(11, 13)}</small></div>))}</div></div></>}
      <p className="muted">{t.fcSrcTmd}</p>
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
