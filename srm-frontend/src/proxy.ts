import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = ['/admin', '/technician', '/manager', '/customer'];
const authPrefixes = ['/login', '/signup', '/shop', '/forgot-password', '/reset-password', '/reset-success'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix)) && !pathname.startsWith('/admin/onboarding');
  const isAuthRoute = authPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
