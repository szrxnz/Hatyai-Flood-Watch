import { Level } from './types'
export const STALE_MS = 3 * 60 * 60 * 1000
const WATCH = -1.0, HIGH = -0.3
export function computeStatus(level: number | null, at: string | null, bank: number | null, now = Date.now()): { status: Level; diff: number | null } {
  const no = { status: 'nodata' as Level, diff: null }
  if (level == null || !at || bank == null || bank === 0 || !Number.isFinite(level)) return no
  const t = Date.parse(at)
  if (!Number.isFinite(t) || now - t > STALE_MS || t - now > 10 * 60 * 1000) return no
  if (level < -50 || level > 2000) return no
  const diff = +(level - bank).toFixed(2)
  return { diff, status: diff >= 0 ? 'critical' : diff >= HIGH ? 'high' : diff >= WATCH ? 'watch' : 'normal' }
}
