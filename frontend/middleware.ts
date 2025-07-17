import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/calendar'];
  const guestOnlyPaths = ['/login', '/register'];

  if (protectedPaths.includes(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && guestOnlyPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/calendar', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [], // ['/calendar/:path*', '/login/:path*', '/register/:path*'],
};