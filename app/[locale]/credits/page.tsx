import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import LegalDoc from '@/components/LegalDoc'
import { dict, isLang } from '@/lib/i18n'
import { legal } from '@/lib/legal'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return { title: isLang(params.locale) ? dict[params.locale].legCredits : undefined }
}

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  return <LegalDoc doc={legal('credits', params.locale)} lang={params.locale} />
}
