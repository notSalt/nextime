import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('connect.sid'); // Express-session sets this
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/calendar'];
  const guestOnlyPaths = ['/login', '/register'];

  // Block access to protected pages if not logged in
  if (protectedPaths.includes(pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already logged-in users away from login/register
  if (isLoggedIn && guestOnlyPaths.includes(pathname)) {
    const calendarUrl = new URL('/calendar', request.url);
    return NextResponse.redirect(calendarUrl);
  }

  return NextResponse.next();
}

// Apply to all relevant routes
export const config = {
  matcher: ['/calendar', '/login', '/register'],
};