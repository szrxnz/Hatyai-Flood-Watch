import { NextResponse } from 'next/server'

export const revalidate = 300

const HOST = 'https://hatyaicityclimate.org'
const iso = (s: unknown) => (typeof s === 'string' && /^\d{4}-\d\d-\d\d \d\d:\d\d/.test(s) ? new Date(s.replace(' ', 'T') + '+07:00').toISOString() : null)
const abs = (u: unknown) => {
  if (typeof u !== 'string') return null
  const full = u.startsWith('/') ? HOST + u : u
  return full.startsWith(HOST + '/') ? full : null
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!/^\d{1,4}$/.test(params.id)) return NextResponse.json({ error: 'bad id' }, { status: 400 })
  try {
    const r = await fetch(`${HOST}/api/flood/cam/${params.id}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'hatyai-flood-watch (contact: you@example.com)' } })
    if (!r.ok) return NextResponse.json({ photos: [], overlay: null }, { status: 502 })
    const j = await r.json()
    const photos = (Array.isArray(j?.photos) ? j.photos : []).flatMap((p: any) => {
      const at = iso(p?.atDate), url = abs(p?.photoUrl)
      return at && url ? [{ at, url }] : []
    }).sort((a: { at: string }, b: { at: string }) => a.at.localeCompare(b.at)).slice(-48)
    return NextResponse.json({ at: iso(j?.atDate), photos, overlay: abs(j?.overlayUrl) }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
  } catch { return NextResponse.json({ photos: [], overlay: null }, { status: 502 }) }
}
