export type Lang = 'th' | 'en' | 'zh'
export const LANGS: Lang[] = ['th', 'en', 'zh']
export type Level = 'normal' | 'watch' | 'high' | 'critical' | 'nodata'
export type Name = { th?: string; en?: string }
export interface RawStation {
  id: string; name: Name; river: string | null; lat: number; lng: number
  level: number; prev: number | null; at: string
  bank: number | null
  amphoe: Name; tambon: Name
}
export interface StationView {
  id: string; name: string; river: string; lat: number; lng: number
  level: number | null; diff: number | null; trend: number | null; status: Level; at: string | null
  areaKey: string; areaName: string; amphoe: string
}
