'use client'
import { useEffect, useRef, useState } from 'react'
import { Ic } from '@/components/Icons'
import { isIOS, isStandalone } from '@/lib/pushClient'

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
const KEY = 'pwa-ask', IOS_KEY = 'pwa-ios', DAY = 86400000
const DELAY = 4000

// iOS: เด้งทุกครั้งที่เข้าเว็บ (หลังโหลด ~1.2 วิ) แต่ถ้ากดปิด จะเว้นช่วงเพิ่มขึ้นเรื่อยๆ 1 > 2 > 4 > 7 วัน (ไม่เกิน 7)
const IOS_DELAY = 1200
const iosSnoozeDays = (n: number) => Math.min(2 ** n, 7)

const IOS: Record<string, { title: string; steps: string[]; note: string; inapp: string; ok: string; close: string }> = {
  th: {
    title: 'ติดตั้งบน iPhone / iPad',
    steps: ['กดปุ่ม **แชร์** ที่แถบด้านล่าง (หรือด้านบน) ของ Safari', 'เลื่อนลงแล้วเลือก **“เพิ่มไปยังหน้าจอโฮม”**', 'กด **“เพิ่ม”** แล้วเปิดแอปจากไอคอนบนหน้าจอโฮม'],
    note: 'ต้องใช้ iOS 16.4 ขึ้นไป และต้อง **เปิดจากไอคอนบนหน้าจอโฮม** เท่านั้น จึงจะเปิดการแจ้งเตือนได้',
    inapp: 'ตอนนี้คุณเปิดอยู่ในแอปอื่น (LINE / Facebook ฯลฯ) ให้แตะเมนู ⋯ แล้วเลือก **“เปิดใน Safari”** ก่อน',
    ok: 'เข้าใจแล้ว', close: 'ปิด',
  },
  en: {
    title: 'Install on iPhone / iPad',
    steps: ['Tap **Share** in the bottom (or top) bar of Safari', 'Scroll down and choose **“Add to Home Screen”**', 'Tap **“Add”**, then open the app from the home screen icon'],
    note: 'Requires iOS 16.4 or later, and alerts only work when **opened from the home screen icon**.',
    inapp: 'You are inside another app (LINE / Facebook etc.). Tap the ⋯ menu and choose **“Open in Safari”** first.',
    ok: 'Got it', close: 'Close',
  },
  zh: {
    title: '安装到 iPhone / iPad',
    steps: ['点按 Safari 底部（或顶部）工具栏的**分享**按钮', '向下滑动并选择**“添加到主屏幕”**', '点**“添加”**，然后从主屏幕图标打开应用'],
    note: '需要 iOS 16.4 及以上，且必须**从主屏幕图标打开**才能开启提醒。',
    inapp: '你正在其他应用内（LINE / Facebook 等）。请点 ⋯ 菜单并选择**“在 Safari 中打开”**。',
    ok: '知道了', close: '关闭',
  },
}
const rich = (s: string) => s.split('**').map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p))
const inApp = () => /FBAN|FBAV|Instagram|Line\/|MicroMessenger|Messenger/i.test(navigator.userAgent)

export default function InstallPrompt({ t, lang = 'th' }: { t: Record<string, string>; lang?: string }) {
  const evRef = useRef<BIP | null>(null)
  const [show, setShow] = useState<'' | 'native' | 'ios'>('')
  const [wrongApp, setWrongApp] = useState(false)
  const remember = (days: number) => { try { localStorage.setItem(KEY, String(Date.now() + (days - 7) * DAY)) } catch {} }

  useEffect(() => {
    if (isStandalone()) return
    if (isIOS()) {
      let st = { n: 0, until: 0 }
      try { st = { ...st, ...JSON.parse(localStorage.getItem(IOS_KEY) || '{}') } } catch {}
      try { if (sessionStorage.getItem(IOS_KEY)) return } catch {}   // ปิดไปแล้วใน session นี้ ไม่เด้งซ้ำตอนเปลี่ยนหน้า
      if (Date.now() < st.until) return
      setWrongApp(inApp())
      const id = setTimeout(() => setShow('ios'), IOS_DELAY)
      return () => clearTimeout(id)
    }
    let last = 0
    try { last = Number(localStorage.getItem(KEY) || 0) } catch {}
    if (Date.now() - last < 7 * DAY) return
    const t0 = Date.now()
    let timer: ReturnType<typeof setTimeout> | undefined
    const onBip = (e: Event) => { e.preventDefault(); evRef.current = e as BIP; clearTimeout(timer); timer = setTimeout(() => setShow('native'), Math.max(0, DELAY - (Date.now() - t0))) }
    const onInstalled = () => { clearTimeout(timer); setShow(''); evRef.current = null; remember(365) }
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', onBip); window.removeEventListener('appinstalled', onInstalled) }
  }, [])

  const closeIos = () => {
    setShow('')
    try {
      const st = JSON.parse(localStorage.getItem(IOS_KEY) || '{}')
      const n = Number(st.n) || 0
      localStorage.setItem(IOS_KEY, JSON.stringify({ n: n + 1, until: Date.now() + iosSnoozeDays(n) * DAY }))
      sessionStorage.setItem(IOS_KEY, '1')
    } catch {}
  }
  useEffect(() => {
    if (show !== 'ios') return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeIos()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [show])

  const later = () => { setShow(''); remember(7) }
  const install = async () => {
    const ev = evRef.current
    if (!ev) return
    setShow('')
    try { await ev.prompt(); const c = await ev.userChoice; remember(c.outcome === 'accepted' ? 365 : 7) } catch { remember(7) }
    evRef.current = null
  }

  if (show === 'ios') {
    const g = IOS[lang] ?? IOS.th
    const tiles = ['share', 'plussq', 'plus']
    return (
      <div className="isb" onClick={closeIos}>
        <div className="iss" role="dialog" aria-modal="true" aria-label={g.title} onClick={(e) => e.stopPropagation()}>
          <i className="ish" />
          <div className="ihd">
            <h2>{g.title}</h2>
            <button className="icl" onClick={closeIos} aria-label={g.close}><Ic n="close" /></button>
          </div>
          <ol>
            {g.steps.map((s, i) => (
              <li key={i}>
                <span className="inum">{i + 1}</span>
                <span className="itile">{tiles[i] === 'plus' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg> : <Ic n={tiles[i]} />}</span>
                <p>{rich(s)}</p>
              </li>
            ))}
          </ol>
          {wrongApp && <div className="inote warn">{rich(g.inapp)}</div>}
          <div className="inote">{rich(g.note)}</div>
          <button className="iok" onClick={closeIos}>{g.ok}</button>
        </div>
      </div>
    )
  }
  if (show !== 'native') return null
  return (
    <div className="pwa" role="dialog" aria-label={t.pwaTitle}>
      <img src="/icon-192.png" alt="" width={44} height={44} />
      <div><b>{t.pwaTitle}</b><p>{t.pwaBody}</p></div>
      <div className="acts">
        <button className="rpgo" style={{ width: 'auto', margin: 0, padding: '9px 18px' }} onClick={install}>{t.pwaInstall}</button>
        <button className="ghost" onClick={later}>{t.pwaLater}</button>
      </div>
    </div>
  )
}
