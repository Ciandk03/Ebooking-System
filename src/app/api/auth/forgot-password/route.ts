import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';
import crypto from 'crypto';

// In production, you would use a proper email service like SendGrid, AWS SES, etc.
const RESET_TOKENS = new Map<string, { token: string; expires: number; userId: string }>();

export async function POST(request: NextRequest) {
    console.log('API: POST /api/auth/forgot-password - Password reset request');

    try {
        const body = await request.json();
        const { email } = body;
        
        console.log('API: Password reset request for email:', email);
        
        if (!email) {
            return NextResponse.json({
                success: false,
                error: 'Email is required'
            }, { status: 400 });
        }

        // Find user by email
        const user = await userService.getUserByEmail(email);
        
        if (!user) {
            // Don't reveal if user exists or not for security
            console.log('API: Password reset request for non-existent email:', email);
            return NextResponse.json({
                success: true,
                message: 'If an account with that email exists, password reset instructions have been sent.'
            }, { status: 200 });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour from now
        
        // Store reset token (in production, store in database)
        RESET_TOKENS.set(email, {
            token: resetToken,
            expires: expires,
            userId: user.id
        });

        // In production, send actual email here
        console.log('API: Password reset token generated for user:', email);
        console.log('API: Reset token:', resetToken);
        console.log('API: Reset link: http://localhost:3001/reset-password?token=' + resetToken);
        
        // For development, we'll just log the reset link
        // In production, you would send an email with this link
        
        return NextResponse.json({
            success: true,
            message: 'Password reset instructions have been sent to your email.',
            // Only include this in development
            ...(process.env.NODE_ENV === 'development' && {
                resetLink: `http://localhost:3001/reset-password?token=${resetToken}`
            })
        }, { status: 200 });

    } catch (error) {
        console.error('API: Forgot password error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to process password reset request',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
