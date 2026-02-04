import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    console.log('Middleware accessToken:', accessToken);


    // Public paths that don't need auth
    const isAuthPath = pathname === '/login'        

    let userRole: string | null = null;

    if (accessToken) {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret || jwtSecret.length === 0) {
            console.error("CRITICAL: JWT_SECRET is missing or empty in middleware!");
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const secret = new TextEncoder().encode(jwtSecret);
        const { payload } = await jwtVerify(accessToken, secret);
        userRole = payload.role as string;
    }

    if (!accessToken) {
        if (pathname.startsWith('/admin') ||
            (pathname.startsWith('/members') && pathname !== '/members/memberList') ||
            pathname.startsWith('/student')) {
            console.log("No token, redirecting to /login");
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (accessToken && isAuthPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (accessToken && userRole) {
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/members') &&
            pathname !== '/members/memberList' &&
            userRole !== 'MEMBER' &&
            userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/student') && userRole !== 'STUDENT') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
