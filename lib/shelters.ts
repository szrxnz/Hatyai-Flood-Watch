import { readJson, writeJson } from './kv'
import { delPhoto, newId, putPhoto } from './blob'

export type ShStatus = 'open' | 'full' | 'closed'
export interface Shelter { id: string; name: string; amphoe: string; address: string; lat: number | null; lng: number | null; capacity: number | null; status: ShStatus; phone: string; photos: string[] }

export const MAX_PHOTOS = 6

export const normShelter = (x: any, i = 0): Shelter => ({
  id: String(x.id ?? i), name: String(x.name), amphoe: String(x.amphoe ?? ''), address: String(x.address ?? ''),
  lat: typeof x.lat === 'number' ? x.lat : null, lng: typeof x.lng === 'number' ? x.lng : null,
  capacity: typeof x.capacity === 'number' ? x.capacity : null,
  status: x.status === 'full' || x.status === 'closed' ? x.status : 'open', phone: String(x.phone ?? '').replace(/[^\d+]/g, ''),
  photos: Array.isArray(x.photos) ? x.photos.filter((p: unknown) => typeof p === 'string' && /^[a-z0-9]{6,20}$/.test(p)).slice(0, MAX_PHOTOS) : [],
})

const write = (list: Shelter[]) => writeJson('shelters', 'shelters.json', list)

export async function getShelters(): Promise<Shelter[]> {
  const j = await readJson<unknown>('shelters', 'shelters.json', [])
  return Array.isArray(j) ? j.filter((x) => x && typeof x.name === 'string').map(normShelter) : []
}

export async function saveShelter(s: Omit<Shelter, 'id' | 'photos'> & { id?: string }) {
  const list = await getShelters()
  const prev = s.id ? list.find((x) => x.id === s.id) : undefined
  const item: Shelter = { ...s, id: s.id || newId(), photos: prev?.photos ?? [] }
  await write(list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item])
  return item
}

export async function removeShelter(id: string) {
  const list = await getShelters()
  const gone = list.find((x) => x.id === id)
  await write(list.filter((x) => x.id !== id))
  if (gone) await Promise.all(gone.photos.map(delPhoto))
}

export async function addShelterPhoto(shelterId: string, jpg: Buffer): Promise<Shelter | 'none' | 'full'> {
  const list = await getShelters()
  const s = list.find((x) => x.id === shelterId)
  if (!s) return 'none'
  if (s.photos.length >= MAX_PHOTOS) return 'full'
  const pid = newId()
  await putPhoto(pid, jpg)
  const item = { ...s, photos: [...s.photos, pid] }
  await write(list.map((x) => (x.id === s.id ? item : x)))
  return item
}

export async function removeShelterPhoto(shelterId: string, photoId: string): Promise<boolean> {
  const list = await getShelters()
  const s = list.find((x) => x.id === shelterId)
  if (!s || !s.photos.includes(photoId)) return false
  await write(list.map((x) => (x.id === s.id ? { ...s, photos: s.photos.filter((p) => p !== photoId) } : x)))
  await delPhoto(photoId)
  return true
}
