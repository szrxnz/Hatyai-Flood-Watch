import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import AlertSettings from '@/components/AlertSettings'
import { dict, isLang } from '@/lib/i18n'
import { getStationViews } from '@/lib/data'

export const revalidate = 600

export default async function Alerts({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const t = dict[params.locale]
  const amphoes = [...new Set((await getStationViews('th')).map((s) => s.amphoe).filter((a) => a && a !== '-'))].sort()
  return (
    <main className="wrap page">
      <h1><Ic n="bell" />{t.alTitle}</h1>
      <p className="muted">{t.alSub}</p>
      <AlertSettings t={t} amphoes={amphoes} lang={params.locale} />
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
