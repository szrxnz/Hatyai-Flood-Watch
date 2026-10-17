import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import CamImg from '@/components/CamImg'
import { CAM_SITE, getCams } from '@/lib/cctv'
import { dict, isLang } from '@/lib/i18n'
import { fmtTime } from '@/lib/data'

export const revalidate = 300

export default async function Cctv({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const all = await getCams()
  const cams = all.filter((c) => !c.radar).sort((a, b) => Number(a.offline) - Number(b.offline))
  const L = { hist: t.camHist, live: t.camLive, cmp: t.camCmp, none: t.camNoHist, loading: t.camLoadHist, overlay: t.camOverlay, now: t.camNow, before: t.camBefore, note: t.camStale }
  const radars = all.filter((c) => c.radar && c.image)
  const card = (c: (typeof all)[number]) => (
    <div className="card cam" key={c.id}>
      <div className="row"><b>{c.name}</b><span className={`badge ${c.offline ? 'nodata' : 'normal'}`}>{c.offline ? t.camOff : t.camOn}</span></div>
      {c.image && <CamImg src={c.image} alt={c.name} id={c.id} L={L} />}
      <div className="muted"><Ic n="clock" />{fmtTime(c.at, lang)}{c.sponsor && ` · ${c.sponsor}`}</div>
    </div>
  )
  return (
    <main className="wrap page">
      <h1><Ic n="camera" />{t.cctvTitle}</h1>
      <p className="muted">{t.cctvSub}</p>
      <a className="src" href={CAM_SITE} target="_blank" rel="noopener noreferrer">{t.camCredit}: Hatyai City Climate<Ic n="ext" /></a>
      {all.length === 0 && <div className="card"><b>{t.cctvEmpty}</b></div>}
      <div className="cams">{cams.map(card)}</div>
      {radars.length > 0 && <><h2><Ic n="rain" />{t.camRadar}</h2><div className="cams">{radars.map(card)}</div></>}
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
