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
    signal: AbortSignal.timeout(15000),
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sub: sub.toJSON(), amphoes: c.amphoes, min: c.min, notices: c.notices, sound: c.sound, lang, consent: true }),
  })
  return r.ok
}

export type SubResult = 'ok' | 'denied' | 'unsupported' | 'off' | 'fail'
export let lastErr = ''

const tmo = <X,>(p: Promise<X>, ms: number, stage: string) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error(stage + ' timeout')), ms))])

export async function subscribe(c: Cfg, lang: string): Promise<SubResult> {
  lastErr = ''
  if (!pushSupported()) return 'unsupported'
  let stage = 'perm'
  try {
    const perm = await tmo(Notification.requestPermission(), 60000, stage)
    if (perm !== 'granted') return 'denied'

    stage = 'key'
    const k = await tmo(fetch('/api/push/key'), 10000, stage)
    if (!k.ok) return 'off'
    const key = String((await k.json()).key || '').trim().replace(/^["']|["']$/g, '')
    if (b64ToU8(key).length !== 65) { lastErr = 'bad vapid key length ' + b64ToU8(key).length; return 'fail' }

    stage = 'sw'
    await tmo(navigator.serviceWorker.register('/sw.js'), 10000, stage)
    const reg = await tmo(navigator.serviceWorker.ready, 10000, stage)

    stage = 'push'
    let sub = await tmo(reg.pushManager.getSubscription(), 5000, stage)
    if (!sub) {
      try {
        sub = await tmo(reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(key) }), 20000, stage)
      } catch (e: any) {
        // คีย์เก่าไม่ตรง: ลบ subscription เดิมแล้วลองใหม่
        await (await reg.pushManager.getSubscription())?.unsubscribe()
        sub = await tmo(reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(key) }), 20000, stage)
      }
    }

    stage = 'save'
    const ok = await tmo(syncSub(c, lang), 15000, stage)
    if (!ok) { lastErr = 'save failed'; return 'fail' }
    return 'ok'
  } catch (e: any) {
    lastErr = `${stage}: ${e?.name || ''} ${e?.message || ''}`.trim()
    return 'fail'
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

export let testErr = ''
export async function sendTest(): Promise<boolean> {
  testErr = ''
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (!sub) { testErr = 'no local subscription'; return false }
    const r = await fetch('/api/push/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) })
    if (!r.ok) { const j = await r.json().catch(() => ({})); testErr = `${r.status} ${j.error || ''} ${j.detail || ''}`.trim() }
    return r.ok
  } catch (e: any) { testErr = String(e?.message || e); return false }
}