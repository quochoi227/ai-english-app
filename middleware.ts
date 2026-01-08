import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các routes không cần xác thực
const publicRoutes = ['/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Bỏ qua các static files và public routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.') ||
        publicRoutes.some(route => pathname === route)
    ) {
        return NextResponse.next();
    }

    // Kiểm tra cookie xác thực
    const authCookie = request.cookies.get('auth_token');
    const secretSignature = process.env.SECRET_SIGNATURE;

    // Nếu không có SECRET_SIGNATURE trong env, cho phép truy cập (development mode)
    if (!secretSignature) {
        return NextResponse.next();
    }

    // Nếu không có cookie hoặc giá trị không khớp
    if (!authCookie || authCookie.value !== secretSignature) {
        const loginUrl = new URL('/login', request.url);
        // Lưu URL gốc để redirect sau khi đăng nhập
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
