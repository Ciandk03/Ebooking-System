import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('API: POST /api/auth/logout - User logout');

    try {
        // In a real application, you might want to:
        // 1. Add the token to a blacklist
        // 2. Invalidate the session in your session store
        // 3. Log the logout event for security auditing
        
        console.log('API: User logged out successfully');
        
        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('API: Logout error:', error);
        return NextResponse.json({
            success: false,
            error: 'Logout failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
