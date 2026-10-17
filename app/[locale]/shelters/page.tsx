import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Ic } from '@/components/Icons'
import ShelterList from '@/components/ShelterList'
import { dict, isLang } from '@/lib/i18n'
import { getShelters } from '@/lib/shelters'

export const dynamic = 'force-dynamic'

export default async function Shelters({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  const all = await getShelters()
  return (
    <main className="wrap page">
      <h1><Ic n="shield" />{t.shTitle}</h1>
      <p className="muted">{t.shSub}</p>
      <ShelterList all={all} t={t} lang={lang} />
      <Link className="link" href={`/${lang}/map`}>{t.map}<Ic n="arrow" /></Link>
      <footer>{t.shNote}</footer>
    </main>
  )
}
