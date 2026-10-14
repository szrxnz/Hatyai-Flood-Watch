import type { Sound } from './sound'

export type Lv = 'watch' | 'high' | 'critical'
export interface Cfg { on: boolean; amphoes: string[]; min: Lv; notices: boolean; sound: Sound; consent: boolean }
export const DEFCFG: Cfg = { on: false, amphoes: [], min: 'high', notices: true, sound: 'siren', consent: false }

export const loadCfg = (): Cfg => { try { return { ...DEFCFG, ...JSON.parse(localStorage.getItem('alertcfg') || '{}') } } catch { return DEFCFG } }
export const saveCfg = (c: Cfg) => { try { localStorage.setItem('alertcfg', JSON.stringify(c)) } catch {} }

export const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
export const isStandalone = () => typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)
export const isIOS = () => typeof navigator !== 'undefined' && (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

function b64ToU8(b: string) {
  const p = '='.repeat((4 - (b.length % 4)) % 4), s = atob((b + p).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(s, (c) => c.charCodeAt(0))
}

export async function syncSub(c: Cfg, lang: string): Promise<boolean> {
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (!sub) return false
  const r = await fetch('/api/push/subscribe', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sub: sub.toJSON(), amphoes: c.amphoes, min: c.min, notices: c.notices, sound: c.sound, lang, consent: true }),
  })
  return r.ok
}

export type SubResult = 'ok' | 'denied' | 'unsupported' | 'off' | 'fail'
export async function subscribe(c: Cfg, lang: string): Promise<SubResult> {
  if (!pushSupported()) return 'unsupported'
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return 'denied'
  const k = await fetch('/api/push/key')
  if (!k.ok) return 'off'
  const { key } = await k.json()
  try {
    await navigator.serviceWorker.register('/sw.js')
    const reg = await navigator.serviceWorker.ready
    let sub = await reg.pushManager.getSubscription()
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(key) })
    return (await syncSub(c, lang)) ? 'ok' : 'fail'
  } catch {
    try {
      const reg = await navigator.serviceWorker.ready
      await (await reg.pushManager.getSubscription())?.unsubscribe()
      await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(key) })
      return (await syncSub(c, lang)) ? 'ok' : 'fail'
    } catch { return 'fail' }
  }
}

export async function unsubscribe() {
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (!sub) return
    await fetch('/api/push/subscribe', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) }).catch(() => {})
    await sub.unsubscribe()
  } catch {}
}

export async function sendTest(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (!sub) return false
    const r = await fetch('/api/push/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) })
    return r.ok
  } catch { return false }
}
