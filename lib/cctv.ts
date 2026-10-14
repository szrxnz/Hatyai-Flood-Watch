const API = 'https://hatyaicityclimate.org/api/flood/cams'
const HOST = 'https://hatyaicityclimate.org/'
export const CAM_SITE = HOST
const HIDDEN = ['city camera 2', 'ภาพจากเครือข่าย']
export interface Cam { id: string; name: string; lat: number | null; lng: number | null; image: string | null; sponsor: string; at: string | null; offline: boolean; radar: boolean }

const iso = (s: unknown) => (typeof s === 'string' && /^\d{4}-\d\d-\d\d \d\d:\d\d/.test(s) ? new Date(s.replace(' ', 'T') + '+07:00').toISOString() : null)

export async function getCams(): Promise<Cam[]> {
  try {
    const r = await fetch(API, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'hatyai-flood-watch (contact: you@example.com)' } })
    if (!r.ok) return []
    const j = await r.json()
    if (!Array.isArray(j?.items)) return []
    const now = Date.now()
    return j.items.flatMap((x: any): Cam[] => {
      if (!x || x.enable !== 1 || typeof x.title !== 'string') return []
      if (HIDDEN.includes(x.title.trim().toLowerCase())) return []
      const at = iso(x.atDate)
      const photo = typeof x.photo === 'string' && x.photo.startsWith(HOST) ? x.photo : null
      const lat = typeof x.location?.latitude === 'number' ? x.location.latitude : null
      const lng = typeof x.location?.longitude === 'number' ? x.location.longitude : null
      const radar = /^R\d/.test(x.code ?? '') || lat == null
      return [{ id: String(x.cameraId), name: x.title, lat, lng, image: photo, sponsor: String(x.sponsorName ?? '').trim(), at,
        offline: !!x.statusMsg || !at || now - Date.parse(at) > 3 * 3600_000, radar }]
    })
  } catch { return [] }
}
