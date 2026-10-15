export type Mode = 'auto' | 'light' | 'dark'
export const MODES: Mode[] = ['auto', 'light', 'dark']
const KEY = 'themeMode'
const COLOR = { light: '#ffffff', dark: '#06172a' }

export const readMode = (): Mode => {
  try { const m = localStorage.getItem(KEY); return m === 'dark' || m === 'auto' ? m : 'light' } catch { return 'light' }
}
export const effective = (m: Mode): 'light' | 'dark' =>
  m === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : m

let txTimer: ReturnType<typeof setTimeout> | undefined

// animate=true: เฟดทั้งหน้าอย่างนุ่มนวล (View Transitions ถ้าเบราว์เซอร์รองรับ ไม่งั้นใช้ transition ผ่านคลาส .theme-tx)
export function applyMode(m: Mode, save = true, animate = false) {
  const e = effective(m), root = document.documentElement
  const set = () => {
    root.dataset.mode = m; root.dataset.theme = e
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', COLOR[e])
  }
  if (save) { try { m === 'light' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, m) } catch {} }
  const same = root.dataset.theme === e
  const still = !animate || same || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (still) { set(); return }
  const vt = (document as any).startViewTransition as undefined | ((cb: () => void) => unknown)
  if (typeof vt === 'function') { vt.call(document, set); return }
  root.classList.add('theme-tx')
  set()
  clearTimeout(txTimer)
  txTimer = setTimeout(() => root.classList.remove('theme-tx'), 500)
}
