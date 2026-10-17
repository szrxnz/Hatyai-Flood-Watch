import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import ReportFeed from '@/components/ReportFeed'
import { dict, isLang } from '@/lib/i18n'

export default function Reports({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const t = dict[params.locale]
  return (
    <main className="wrap page">
      <h1><Ic n="camera" />{t.rfTitle}</h1>
      <p className="muted">{t.rfSub}</p>
<<<<<<< HEAD
      <ReportFeed t={t} lang={params.locale} />
=======
      <ReportFeed t={t} />
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
