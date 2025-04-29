import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // const token = request.cookies.get('auth-token')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');
  const isDashboardRoute = !isAuthRoute && request.nextUrl.pathname !== '/';

  // Redireciona para a página de login se não estiver autenticado e tentar acessar o dashboard
  // if (!token && isDashboardRoute) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // // Redireciona para o dashboard se já estiver autenticado e tentar acessar rotas de autenticação
  // if (token && isAuthRoute) {
  //   return NextResponse.redirect(new URL('/products', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};