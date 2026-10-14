'use client'
import { Ic } from '@/components/Icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { MODES, Mode, applyMode, readMode } from '@/lib/theme'

type T = Record<string, string>
const ITEMS = [{ k: 'home', p: '', i: 'home', b: 1 }, { k: 'map', p: '/map', i: 'map', b: 1 }, { k: 'area', p: '/area', i: 'pin', b: 0 }, { k: 'forecast', p: '/forecast', i: 'rain', b: 1 }, { k: 'shelters', p: '/shelters', i: 'shield', b: 1 }, { k: 'updates', p: '/updates', i: 'news', b: 0 }, { k: 'cctv', p: '/cctv', i: 'camera', b: 0 }, { k: 'reports', p: '/reports', i: 'drop', b: 1 }]

export function Nav({ lang, t, variant }: { lang: string; t: T; variant: 'side' | 'bottom' }) {
  const base = `/${lang}`
  const path = usePathname() ?? base
  return (
    <nav className={variant === 'side' ? 'nav' : 'bnav'}>
      {ITEMS.filter((it) => variant === 'side' || it.b).map((it) => {
        const href = base + it.p
        const on = it.p === '' ? path === base : path.startsWith(href)
        return <Link key={it.k} href={href} className={on ? 'on' : ''}><span><Ic n={it.i} /></span><em>{t[it.k]}</em></Link>
      })}
    </nav>
  )
}

export function TopTools({ lang, t }: { lang: string; t: T }) {
  const path = usePathname() ?? `/${lang}`
  const [mode, setMode] = useState<Mode>('auto')
  const [lbl, setLbl] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    setMode(readMode())
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => { if (readMode() === 'auto') applyMode('auto', false) }
    mq.addEventListener('change', on)
    return () => { mq.removeEventListener('change', on); clearTimeout(timer.current) }
  }, [])
  const names: Record<Mode, string> = { auto: t.themeAuto, light: t.themeLight, dark: t.themeDark }
  const icons: Record<Mode, string> = { auto: 'device', light: 'sun', dark: 'moon' }
  const cycle = () => {
    const n = MODES[(MODES.indexOf(mode) + 1) % MODES.length]
    setMode(n); applyMode(n)
    setLbl(names[n]); clearTimeout(timer.current); timer.current = setTimeout(() => setLbl(''), 1600)
  }
  return (
    <div className="topbar">
      <div className="seg">
        {[['th', 'TH'], ['en', 'EN'], ['zh', '中']].map(([l, n]) => (
          <Link key={l} href={path.replace(/^\/(th|en|zh)/, `/${l}`)} className={l === lang ? 'on' : ''}>{n}</Link>
        ))}
      </div>
      <button className="iconbtn" onClick={cycle} aria-label={`${t.theme}: ${names[mode]}`} title={names[mode]}><span key={mode} className="spin"><Ic n={icons[mode]} /></span></button>
      <Link href={`/${lang}/alerts`} className="iconbtn" title={t.alerts} aria-label={t.alerts}><Ic n="bell" /></Link>
      {lbl && <span className="tlbl" role="status">{lbl}</span>}
    </div>
  )
}
