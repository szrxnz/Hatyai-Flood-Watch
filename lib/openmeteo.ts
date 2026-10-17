export interface RainHour { t: string; mm: number; prob: number }
export async function fetchRain(lat: number, lng: number): Promise<RainHour[] | null> {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=precipitation,precipitation_probability&forecast_hours=24&timezone=Asia%2FBangkok`
    const res = await fetch(u, { next: { revalidate: 900 }, signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const j = await res.json()
    const h = j.hourly
    return h.time.map((t: string, i: number) => ({ t, mm: h.precipitation[i] ?? 0, prob: h.precipitation_probability[i] ?? 0 }))
  } catch { return null }
}

export interface FcDay { d: string; code: number; max: number; min: number; mm: number; prob: number; wind: number }
type Ar = { k: string; g: 'hy' | 'sk'; th: string; en: string; zh: string; lat: number; lng: number }
const A = (g: 'hy' | 'sk', k: string, th: string, en: string, lat: number, lng: number, zh = en): Ar => ({ k, g, th, en, zh, lat, lng })
export const FC_AREAS: Ar[] = [
  A('hy', 'hatyai', 'หาดใหญ่', 'Hat Yai', 7.0086, 100.4747, '合艾'),
  A('hy', 'khuanlang', 'ควนลัง', 'Khuan Lang', 7.0, 100.40),
  A('hy', 'khohong', 'คอหงส์', 'Kho Hong', 7.04, 100.50),
  A('hy', 'khutao', 'คูเต่า', 'Khu Tao', 6.96, 100.45),
  A('hy', 'khlonghae', 'คลองแห', 'Khlong Hae', 6.93, 100.46),
  A('hy', 'khlongut', 'คลองอู่ตะเภา', 'Khlong U-Taphao', 6.99, 100.52),
  A('hy', 'chalung', 'ฉลุง', 'Chalung', 7.0, 100.36),
  A('hy', 'thungyai', 'ทุ่งใหญ่', 'Thung Yai', 6.90, 100.40),
  A('hy', 'thakham', 'ท่าข้าม', 'Tha Kham', 7.05, 100.43),
  A('hy', 'namnoi', 'น้ำน้อย', 'Nam Noi', 7.05, 100.46),
  A('hy', 'banphru', 'บ้านพรุ', 'Ban Phru', 6.95, 100.50),
  A('hy', 'phatong', 'พะตง', 'Phatong', 7.08, 100.52),
  A('hy', 'thungtamsao', 'ทุ่งตำเสา', 'Thung Tamsao', 6.95, 100.58),
  A('sk', 'khlonghoikhong', 'คลองหอยโข่ง', 'Khlong Hoi Khong', 6.88, 100.39),
  A('sk', 'bangklam', 'บางกล่ำ', 'Bang Klam', 7.10, 100.45),
  A('sk', 'sadao', 'สะเดา', 'Sadao', 6.6385, 100.4260, '沙道'),
  A('sk', 'nammom', 'นาหม่อม', 'Na Mom', 6.97, 100.36),
  A('sk', 'rattaphum', 'รัตภูมิ', 'Rattaphum', 7.1417, 100.2833, '叻达蓬'),
  A('sk', 'khuanniang', 'ควนเนียง', 'Khuan Niang', 7.2, 100.43, '宽宁'),
  A('sk', 'songkhla', 'เมืองสงขลา', 'Songkhla', 7.1897, 100.5951, '宋卡市'),
  A('sk', 'singhanakhon', 'สิงหนคร', 'Singhanakhon', 7.31, 100.57),
  A('sk', 'chana', 'จะนะ', 'Chana', 6.87, 100.73),
  A('sk', 'nathawi', 'นาทวี', 'Na Thawi', 6.76, 100.68),
  A('sk', 'thepha', 'เทพา', 'Thepha', 6.84, 100.97),
  A('sk', 'sabayoi', 'สะบ้าย้อย', 'Saba Yoi', 6.64, 100.98),
  A('sk', 'sathingphra', 'สทิงพระ', 'Sathing Phra', 7.50, 100.43),
  A('sk', 'krasaesin', 'กระแสสินธุ์', 'Krasae Sin', 7.55, 100.47),
  A('sk', 'ranot', 'ระโนด', 'Ranot', 7.80, 100.40),
]
export async function fetchDaily(lat: number, lng: number): Promise<FcDay[] | null> {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=7&timezone=Asia%2FBangkok`
    const res = await fetch(u, { next: { revalidate: 900 }, signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const d = (await res.json()).daily
    return d.time.map((t: string, i: number) => ({ d: t, code: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i], mm: d.precipitation_sum[i] ?? 0, prob: d.precipitation_probability_max[i] ?? 0, wind: d.wind_speed_10m_max[i] ?? 0 }))
  } catch { return null }
}

const TMD_COND: Record<number, number> = { 1: 0, 2: 2, 3: 3, 4: 3, 5: 61, 6: 63, 7: 65, 8: 95, 9: 0, 10: 0, 11: 0, 12: 0 }

export async function fetchTmdDaily(lat: number, lng: number): Promise<FcDay[] | null> {
  const token = process.env.TMD_TOKEN
  if (!token) return null
  try {
    const start = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10)
    const u = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/at?lat=${lat}&lon=${lng}&fields=tc_max,tc_min,rain,cond,ws10m&starttime=${start}&duration=7`
    const res = await fetch(u, { headers: { accept: 'application/json', authorization: `Bearer ${token}` }, next: { revalidate: 1800 }, signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const f = (await res.json())?.WeatherForecasts?.[0]?.forecasts
    if (!Array.isArray(f) || !f.length) return null
    return f.map((x: { time: string; data: Record<string, number> }) => ({
      d: String(x.time).slice(0, 10), code: TMD_COND[x.data.cond] ?? 3, max: x.data.tc_max, min: x.data.tc_min,
      mm: x.data.rain ?? 0, prob: -1, wind: (x.data.ws10m ?? 0) * 3.6,
    }))
  } catch { return null }
}
