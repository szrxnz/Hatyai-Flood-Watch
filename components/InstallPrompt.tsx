'use client'
import { useEffect, useRef, useState } from 'react'
import { isIOS, isStandalone } from '@/lib/pushClient'

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
const KEY = 'pwa-ask', DAY = 86400000
const DELAY = 4000

export default function InstallPrompt({ t, lang = 'th' }: { t: Record<string, string>; lang?: string }) {
  const evRef = useRef<BIP | null>(null)
  const [show, setShow] = useState<'' | 'native' | 'ios'>('')
  const remember = (days: number) => { try { localStorage.setItem(KEY, String(Date.now() + (days - 7) * DAY)) } catch {} }

  useEffect(() => {
    if (isStandalone()) return
    let last = 0
    try { last = Number(localStorage.getItem(KEY) || 0) } catch {}
    if (Date.now() - last < 7 * DAY) return
    const t0 = Date.now()
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = (kind: 'native' | 'ios') => { clearTimeout(timer); timer = setTimeout(() => setShow(kind), Math.max(0, DELAY - (Date.now() - t0))) }
    const onBip = (e: Event) => { e.preventDefault(); evRef.current = e as BIP; schedule('native') }
    const onInstalled = () => { clearTimeout(timer); setShow(''); evRef.current = null; remember(365) }
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    if (isIOS()) schedule('ios')
    return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', onBip); window.removeEventListener('appinstalled', onInstalled) }
  }, [])

  const later = () => { setShow(''); remember(7) }
  const install = async () => {
    const ev = evRef.current
    if (!ev) return
    setShow('')
    try { await ev.prompt(); const c = await ev.userChoice; remember(c.outcome === 'accepted' ? 365 : 7) } catch { remember(7) }
    evRef.current = null
  }
  if (!show) return null
  return (
    <div className="pwa" role="dialog" aria-label={t.pwaTitle}>
      <img src="/icon-192.png" alt="" width={44} height={44} />
      <div><b>{t.pwaTitle}</b><p>{show === 'ios' ? t.pwaIosBody : t.pwaBody}</p><a className="link" href={`/${lang}/install`} style={{ fontSize: '.88rem' }}>{t.pwaHow}</a></div>
      <div className="acts">
        {show === 'native' && <button className="rpgo" style={{ width: 'auto', margin: 0, padding: '9px 18px' }} onClick={install}>{t.pwaInstall}</button>}
        <button className="ghost" onClick={later}>{t.pwaLater}</button>
      </div>
    </div>
  )
}
