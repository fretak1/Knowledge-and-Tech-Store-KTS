import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * PUBLIC ROUTES
   * Anyone can access these
   */
  const publicRoutes = ['/login'];

  const isPublicRoute = publicRoutes.includes(pathname);

  /**
   * PROTECTED ROUTES
   * We do NOT check roles or cookies here
   * Real auth is handled by the backend (/me)
   */
  const protectedPrefixes = ['/admin', '/members', '/student'];

  const isProtectedRoute = protectedPrefixes.some(prefix =>
    pathname.startsWith(prefix)
  );

  /**
   * If user tries to access protected routes,
   * allow navigation and let the page itself
   * validate auth via backend API.
   */
  if (isProtectedRoute) {
    return NextResponse.next();
  }

  /**
   * Prevent logged-in users from visiting /login
   * (OPTIONAL — only if you store a frontend cookie later)
   * For now, allow it.
   */
  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
