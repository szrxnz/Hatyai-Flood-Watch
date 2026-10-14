import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdmin } from '@/lib/auth'
import { getShelters, removeShelter, saveShelter } from '@/lib/shelters'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  id: z.string().max(40).optional(),
  name: z.string().trim().min(1).max(120),
  amphoe: z.string().trim().max(60),
  address: z.string().trim().max(200),
  lat: z.number().min(5.9).max(7.7).nullable(),
  lng: z.number().min(99.6).max(101.5).nullable(),
  capacity: z.number().int().min(0).max(100000).nullable(),
  status: z.enum(['open', 'full', 'closed']),
  phone: z.string().trim().max(20),
})

const auth = () => NextResponse.json({ error: 'auth' }, { status: 401 })

export async function GET() {
  return NextResponse.json(await getShelters(), { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return auth()
  const p = schema.safeParse(await req.json().catch(() => null))
  if (!p.success) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  try { return NextResponse.json(await saveShelter(p.data)) } catch { return NextResponse.json({ error: 'storage' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return auth()
  try { await removeShelter(req.nextUrl.searchParams.get('id') ?? ''); return NextResponse.json({ ok: true }) } catch { return NextResponse.json({ error: 'storage' }, { status: 500 }) }
}
