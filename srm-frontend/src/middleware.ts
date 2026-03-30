import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that require authentication
const protectedPrefixes = [
  '/admin',
  '/technician',
  '/manager',
  '/customer' // The specific dashboards for different roles
];

// Define paths that are strictly accessible BEFORE login (auth pages)
const authPrefixes = [
  '/login',
  '/signup',
  '/shop',
  '/forgot-password',
  '/reset-password',
  '/reset-success'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
  const isAuthRoute = authPrefixes.some(prefix => pathname.startsWith(prefix));

  // 1. If trying to access a protected route without a token -> Redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optionally preserve the attempted URL to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access an auth route (like /login) WITH a token -> Redirect to dashboard
  if (isAuthRoute && token) {
    // Note: We don't know the exact role purely from the generic token cookie here easily unless it's a decoded JWT.
    // For now, redirect to a generic landing or the admin dashboard. The client can redirect if wrong role.
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 3. Otherwise, allow the request to proceed (e.g., marketing pages, public assets)
  return NextResponse.next();
}

export const config = {
  // Matcher ignores _next/static, _next/image, favicon.ico, and api routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};