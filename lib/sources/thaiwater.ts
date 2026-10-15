import { z } from 'zod'
import { RawStation } from '../types'

export const THAIWATER_URL = process.env.THAIWATER_URL || 'https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_load'
const PROVINCE = process.env.PROVINCE_CODE || '90'

const num = z.preprocess((v) => (v == null || v === '' ? undefined : Number(v)), z.number().finite())
const numOrNull = z.preprocess((v) => (v == null || v === '' ? null : Number(v)), z.number().finite().nullable())
const Name = z.object({ th: z.string().optional(), en: z.string().optional() }).passthrough()

const Row = z.object({
  waterlevel_datetime: z.string(),
  waterlevel_msl_previous: numOrNull,
  waterlevel_msl: num,
  station: z.object({
    id: z.coerce.number(), tele_station_name: Name,
    tele_station_lat: num, tele_station_long: num, min_bank: numOrNull,
  }),
  geocode: z.object({ province_code: z.string(), amphoe_name: Name, tumbon_name: Name }),
  river_name: z.string().nullish(),
})

const toIso = (s: string) => s.trim().replace(' ', 'T') + ':00+07:00'

export async function fetchStations(): Promise<RawStation[]> {
  if (process.env.MOCK === '1') {
    const at = new Date().toISOString()
    return [
      { id: 'm1', name: { th: 'สถานีจำลอง 1', en: 'Mock 1' }, river: 'คลองอู่ตะเภา', lat: 7.0086, lng: 100.4747, level: 9.5, prev: 9.3, at, bank: 10, amphoe: { th: 'หาดใหญ่', en: 'Hat Yai' }, tambon: { th: 'หาดใหญ่', en: 'Hat Yai' } },
      { id: 'm2', name: { th: 'สถานีจำลอง 2', en: 'Mock 2' }, river: 'คลองเตย', lat: 7.03, lng: 100.45, level: 10.2, prev: 10.3, at, bank: 10, amphoe: { th: 'หาดใหญ่', en: 'Hat Yai' }, tambon: { th: 'คอหงส์', en: 'Kho Hong' } },
    ]
  }
  try {
    const res = await fetch(THAIWATER_URL, {
      headers: { 'User-Agent': 'hatyai-flood-open-source (contact: you@example.com)' },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return []
    const rows: unknown[] = (await res.json())?.waterlevel_data?.data ?? []
    const out: RawStation[] = []
    for (const r of rows) {
      const p = Row.safeParse(r)
      if (!p.success || p.data.geocode.province_code !== PROVINCE) continue
      const d = p.data
      out.push({
        id: String(d.station.id), name: d.station.tele_station_name, river: d.river_name ?? null,
        lat: d.station.tele_station_lat, lng: d.station.tele_station_long,
        level: d.waterlevel_msl, prev: d.waterlevel_msl_previous, at: toIso(d.waterlevel_datetime), bank: d.station.min_bank,
        amphoe: d.geocode.amphoe_name, tambon: d.geocode.tumbon_name,
      })
    }
    return out
  } catch { return [] }
}
