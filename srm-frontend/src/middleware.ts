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
    '/shop',
    '/registration-staff',
    '/signup/technician',  // ✅ Add this
  ];

  // ✅ Check if current path matches any public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    // ✅ REMOVED the redirect logic - allow users to access /login and /signup freely
    // even if they have a token
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