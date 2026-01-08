import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Lấy password và signature từ biến môi trường
        const appPassword = process.env.APP_PASSWORD;
        const secretSignature = process.env.SECRET_SIGNATURE;

        // Kiểm tra biến môi trường
        if (!appPassword || !secretSignature) {
            return NextResponse.json(
                { error: 'Lỗi cấu hình server. Vui lòng liên hệ quản trị viên.' },
                { status: 500 }
            );
        }

        // Kiểm tra password
        if (!password || password !== appPassword) {
            return NextResponse.json(
                { error: 'Mật khẩu không đúng' },
                { status: 401 }
            );
        }

        // Tạo response với cookie xác thực
        const response = NextResponse.json({ success: true });

        // Set cookie với SECRET_SIGNATURE
        response.cookies.set('auth_token', secretSignature, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            // Cookie hết hạn sau 7 ngày
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}
