import { NextRequest, NextResponse } from 'next/server'
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone(); url.pathname = '/th'
  return NextResponse.redirect(url)
}
export const config = { matcher: ['/'] }
