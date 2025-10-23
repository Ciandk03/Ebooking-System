import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';
import { hashPassword } from '../../../../utils/encryption';
import crypto from 'crypto';

const RESET_TOKENS = new Map<string, { token: string; expires: number; userId: string }>();

export async function POST(request: NextRequest) {
    console.log('API: POST /api/auth/reset-password - Password reset');

    try {
        const body = await request.json();
        const { token, password, confirmPassword } = body;
        
        console.log('API: Password reset attempt with token');
        
        if (!token || !password || !confirmPassword) {
            return NextResponse.json({
                success: false,
                error: 'Token, password, and confirmation are required'
            }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({
                success: false,
                error: 'Passwords do not match'
            }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({
                success: false,
                error: 'Password must be at least 8 characters long'
            }, { status: 400 });
        }

        // Find reset token
        let tokenData = null;
        for (const [email, data] of RESET_TOKENS.entries()) {
            if (data.token === token) {
                tokenData = { email, ...data };
                break;
            }
        }

        if (!tokenData) {
            console.log('API: Invalid reset token');
            return NextResponse.json({
                success: false,
                error: 'Invalid or expired reset token'
            }, { status: 400 });
        }

        // Check if token is expired
        if (Date.now() > tokenData.expires) {
            console.log('API: Expired reset token');
            RESET_TOKENS.delete(tokenData.email);
            return NextResponse.json({
                success: false,
                error: 'Reset token has expired. Please request a new password reset.'
            }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = hashPassword(password);
        
        // Update user password
        await userService.updateUser(tokenData.userId, {
            password: hashedPassword
        });

        // Remove used token
        RESET_TOKENS.delete(tokenData.email);

        console.log('API: Password reset successful for user:', tokenData.email);
        
        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('API: Reset password error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to reset password',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
