import '../globals.css'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Nav, TopTools } from '@/components/Chrome'
import { NoticeBar } from '@/components/NoticeList'
import ReportFlood from '@/components/ReportFlood'
import { AlertWatcher } from '@/components/AlertSettings'
import InstallPrompt from '@/components/InstallPrompt'
import Splash from '@/components/Splash'
import OrientationGuard from '@/components/OrientationGuard'
import BackBar from '@/components/BackBar'
import LegalLinks from '@/components/LegalLinks'
import { Ic } from '@/components/Icons'
import { dict, isLang } from '@/lib/i18n'
import { LANGS } from '@/lib/types'

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }
export function generateStaticParams() { return LANGS.map((locale) => ({ locale })) }
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const l = isLang(params.locale) ? params.locale : 'th'
  return { title: dict[l].title, description: dict[l].sub, manifest: '/manifest.webmanifest', icons: { icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }], apple: '/icon-192.png' } }
}
const font = IBM_Plex_Sans_Thai({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font' })
const THEME_JS = "try{var m=localStorage.getItem('themeMode');if(m!=='dark'&&m!=='auto')m='light';var d=m==='dark'||(m==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.mode=m;r.dataset.theme=d?'dark':'light';document.querySelector('meta[name=theme-color]').setAttribute('content',d?'#06172a':'#ffffff');if(sessionStorage.getItem('splash'))r.dataset.splash='0'}catch(e){document.documentElement.dataset.theme='light'}"

export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLang(params.locale)) notFound()
  const lang = params.locale, t = dict[lang]
  return (
    <html lang={lang} className={font.variable} suppressHydrationWarning>
      <head><meta name="theme-color" content="#ffffff" /><script dangerouslySetInnerHTML={{ __html: THEME_JS }} /></head>
      <body>
        <Splash text={t.loading} />
        <OrientationGuard />
        <AlertWatcher t={t} lang={lang} />
        <div className="shell">
          <aside className="side">
            <div className="brand"><span><Ic n="wave" /></span><b>{t.title1}<br />{t.title2}</b></div>
            <Nav lang={lang} t={t} variant="side" />
            <div className="sidefoot"><span>{t.join1}<br />{t.join2}</span><b><Ic n="heart" />{t.join3}</b></div>
          </aside>
          <div className="content">
            <BackBar lang={lang} t={t} />
            <TopTools lang={lang} t={t} />
            <NoticeBar lang={lang} t={t} />
            {children}
            <LegalLinks lang={lang} t={t} />
          </div>
          <Nav lang={lang} t={t} variant="bottom" />
          <ReportFlood t={t} />
          <InstallPrompt t={t} lang={lang} />
        </div>
      </body>
    </html>
  )
}
