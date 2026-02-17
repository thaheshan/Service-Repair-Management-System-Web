// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // ✅ ALL public routes - no token required
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/signup/admin',
    '/signup/technician',
    '/signup/shop',
    '/registration-staff',
  ];

  // ✅ Check if current path matches any public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    // If user already has token and tries to access login/signup
    // redirect them to dashboard
    if (token && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow access to all public routes
    return NextResponse.next();
  }

  // ✅ Protected routes - require token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};