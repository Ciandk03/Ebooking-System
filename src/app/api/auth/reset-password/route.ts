import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';
import { hashPassword } from '../../../../utils/encryption';
import { getResetToken, deleteResetToken, validateTokenNotExpired } from '../../../../utils/tokenStore';

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

    const tokenData = getResetToken(token);

    if (!tokenData) {
      console.log('API: Invalid reset token');
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired reset token'
      }, { status: 400 });
    }

    if (!validateTokenNotExpired(tokenData.data.expires)) {
      console.log('API: Expired reset token');
      deleteResetToken(tokenData.email);
      return NextResponse.json({
        success: false,
        error: 'Reset token has expired. Please request a new password reset.'
      }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    await userService.updateUser(tokenData.data.userId, {
      password: hashedPassword
    });

    deleteResetToken(tokenData.email);

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
