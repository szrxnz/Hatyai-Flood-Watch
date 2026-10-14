export type Mode = 'auto' | 'light' | 'dark'
export const MODES: Mode[] = ['auto', 'light', 'dark']
const KEY = 'themeMode'
const COLOR = { light: '#ffffff', dark: '#06172a' }

export const readMode = (): Mode => {
  try { const m = localStorage.getItem(KEY); return m === 'light' || m === 'dark' ? m : 'auto' } catch { return 'auto' }
}
export const effective = (m: Mode): 'light' | 'dark' =>
  m === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : m

export function applyMode(m: Mode, save = true) {
  const e = effective(m), root = document.documentElement
  root.dataset.mode = m; root.dataset.theme = e
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', COLOR[e])
  if (save) { try { m === 'auto' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, m) } catch {} }
}
