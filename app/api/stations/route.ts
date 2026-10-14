import { NextResponse } from 'next/server'
import { getStationViews } from '@/lib/data'

export const revalidate = 300

export async function GET() {
  const v = await getStationViews('th')
  return NextResponse.json(v.map((s) => ({ id: s.id, name: s.name, amphoe: s.amphoe, status: s.status })))
}
