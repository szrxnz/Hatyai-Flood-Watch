import { notFound } from 'next/navigation'
import { Ic } from '@/components/Icons'
import NoticeList from '@/components/NoticeList'
import { dict, isLang } from '@/lib/i18n'

export default function Notices({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const t = dict[params.locale]
  return (
    <main className="wrap page">
      <h1><Ic n="alert" />{t.ntTitle}</h1>
      <p className="muted">{t.ntSub}</p>
      <NoticeList lang={params.locale} t={t} />
      <footer>{t.disclaimer}</footer>
    </main>
  )
}
