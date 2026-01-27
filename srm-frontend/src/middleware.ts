// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Public routes (splash screen, login, signup)
  const publicRoutes = ['/', '/login', '/signup'];
  
  if (publicRoutes.includes(pathname)) {
    // If user has token and tries to access login/signup, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow access to public routes
    return NextResponse.next();
  }

  // Protected routes - require token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};