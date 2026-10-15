import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import { Trend } from '@/components/Dashboard'
import { dict, isLang } from '@/lib/i18n'
import { fmtTime, getStationViews } from '@/lib/data'

export const revalidate = 600

export default async function Updates({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const items = [...(await getStationViews(lang))].sort((a, b) => (b.at ?? '').localeCompare(a.at ?? ''))
  return (
    <main className="wrap page">
      <h1><Ic n="news" />{t.updatesTitle}</h1>
      <p className="muted">{t.updatesSub}</p>
      <div className="feed">
        {items.map((s) => (
          <div key={s.id} className={`card st ${s.status}`}>
            <div className="row"><span className="muted"><Ic n="clock" />{fmtTime(s.at, lang)}</span><span className={`badge ${s.status}`}>{t[s.status]}</span></div>
            <b>{s.name}</b> <span className="muted">· {s.areaName}</span>
            <div>{s.level != null && s.diff != null
              ? <>{t.level} {s.level.toFixed(2)} {t.m} · {Math.abs(s.diff).toFixed(2)} {t.m} {s.diff >= 0 ? t.above : t.below} <Trend v={s.trend} t={t} /></>
              : <span className="muted">{t.nodata}</span>}</div>
          </div>
        ))}
      </div>
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
