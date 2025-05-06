import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const token = request.cookies.get('auth-token')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isDashboardRoute = !isAuthRoute && request.nextUrl.pathname !== '/';

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};