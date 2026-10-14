'use client'
import { Ic } from '@/components/Icons'
import { usePathname, useRouter } from 'next/navigation'

type T = Record<string, string>
const MAIN = ['', 'map', 'forecast', 'shelters', 'reports']
const TITLE: Record<string, string> = { area: 'area', updates: 'updates', cctv: 'cctv', alerts: 'alerts', notices: 'notices', privacy: 'legPrivacy', terms: 'legTerms', credits: 'legCredits', admin: 'staffLink' }

export default function BackBar({ lang, t }: { lang: string; t: T }) {
  const path = usePathname() ?? `/${lang}`
  const router = useRouter()
  const seg = path.split('/')[2] ?? ''
  if (MAIN.includes(seg)) return null
  const go = () => { if (window.history.length > 1) router.back(); else router.push(`/${lang}`) }
  return (
    <div className="backbar">
      <button type="button" className="backbtn" onClick={go} aria-label={t.back}><Ic n="chev" /><span>{t.back}</span></button>
      <b>{t[TITLE[seg]] ?? ''}</b>
    </div>
  )
}
