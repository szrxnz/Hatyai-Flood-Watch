import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Ic } from '@/components/Icons'
<<<<<<< HEAD
import ShelterList from '@/components/ShelterList'
=======
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
import { dict, isLang } from '@/lib/i18n'
import { getShelters } from '@/lib/shelters'

export const dynamic = 'force-dynamic'

<<<<<<< HEAD
export default async function Shelters({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const all = await getShelters()
=======
export default async function Shelters({ params, searchParams }: { params: { locale: string }; searchParams: { a?: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const all = await getShelters()
  const areas = [...new Set(all.map((s) => s.amphoe).filter(Boolean))].sort()
  const a = searchParams.a && areas.includes(searchParams.a) ? searchParams.a : ''
  const list = a ? all.filter((s) => s.amphoe === a) : all
  const base = `/${lang}/shelters`
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
  return (
    <main className="wrap page">
      <h1><Ic n="shield" />{t.shTitle}</h1>
      <p className="muted">{t.shSub}</p>
<<<<<<< HEAD
      <ShelterList all={all} t={t} lang={lang} />
=======
      {areas.length > 1 && (
        <div className="chips">
          <Link href={base} className={!a ? 'on' : ''}>{t.alAll}</Link>
          {areas.map((x) => <Link key={x} href={`${base}?a=${encodeURIComponent(x)}`} className={a === x ? 'on' : ''}>{x}</Link>)}
        </div>
      )}
      {list.length === 0 && <div className="card"><b>{t.shEmpty}</b><p className="muted">{t.shEmptyHow}</p></div>}
      <div className="feed">
        {list.map((s) => (
          <div key={s.id} className="card shcard">
            <div className="row"><b>{s.name}</b><span className={`badge ${s.status === 'open' ? 'normal' : s.status === 'full' ? 'watch' : 'nodata'}`}>{t['sh_' + s.status]}</span></div>
            <p className="muted">{[s.amphoe, s.address].filter(Boolean).join(' · ')}{s.capacity != null && ` · ${t.shCap} ${s.capacity}`}</p>
            {s.photos.length > 0 && (
              <div className="shphotos">
                {s.photos.map((ph) => <a key={ph} href={`/api/shelters/photo?id=${ph}`} target="_blank" rel="noopener noreferrer"><img src={`/api/shelters/photo?id=${ph}`} alt={s.name} loading="lazy" /></a>)}
              </div>
            )}
            <div className="acts">
              {s.phone && <a className="src" href={`tel:${s.phone}`}><Ic n="phone" />{t.shCall}</a>}
              {s.lat != null && s.lng != null && <a className="src" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}><Ic n="compass" />{t.shNav}</a>}
            </div>
          </div>
        ))}
      </div>
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
      <Link className="link" href={`/${lang}/map`}>{t.map}<Ic n="arrow" /></Link>
      <footer>{t.shNote}</footer>
    </main>
  )
}
