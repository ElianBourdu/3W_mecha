import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const routes_skiping_auth = [
  { path: '/api/auth.*', method: ['POST', 'GET'] },
  { path: '/api/guides.*', method: ['GET'] }
]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (routes_skiping_auth.findIndex(route => route.path))
  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
