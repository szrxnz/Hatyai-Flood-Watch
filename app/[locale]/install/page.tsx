import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import InstallGuide from '@/components/InstallGuide'
import { dict, isLang } from '@/lib/i18n'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return { title: isLang(params.locale) ? dict[params.locale].install : undefined }
}

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  return <InstallGuide lang={params.locale} />
}
