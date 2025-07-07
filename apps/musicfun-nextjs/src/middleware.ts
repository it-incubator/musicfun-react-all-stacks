import { NextRequest, NextResponse } from 'next/server'
import { reauthMiddleware } from '@/reauth-middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  console.log('Middleware')
  const response = reauthMiddleware(request)
  if (response) return response

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/profile', '/api/:path*'], // или любой другой набор путей
}
