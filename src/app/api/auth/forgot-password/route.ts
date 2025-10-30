import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { userService } from '../../../../services/database';
import { sendPasswordResetEmail } from '../../../../utils/mailer';
import { storeResetToken } from '../../../../utils/tokenStore';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('API: POST /api/auth/forgot-password - Password reset request');

  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    console.log('API: Password reset request for email:', email);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await userService.getUserByEmail(email);

    const genericResponse = NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
        ...(process.env.NODE_ENV === 'development' ? { dev: true } : {}),
      },
      { status: 200 }
    );

    if (!user) {
      console.log('API: Password reset request for non-existent email:', email);
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000;

    storeResetToken(email, {
      token: resetToken,
      expires,
      userId: user.id,
    });

    console.log('API: Password reset token generated for user:', email);
    if (process.env.NODE_ENV === 'development') {
      console.log('API: Reset token (dev only):', resetToken);
    }

    const APP_URL = process.env.APP_URL || 'http://localhost:3000';
    const RESET_PAGE_PATH = process.env.RESET_PAGE_PATH || '/reset-password';
    const encodedToken = encodeURIComponent(resetToken);
    const encodedEmail = encodeURIComponent(email);
    const resetUrl = APP_URL + RESET_PAGE_PATH + '?token=' + encodedToken + '&email=' + encodedEmail;

    if (process.env.NODE_ENV === 'development') {
      console.log('API: Reset link (dev only):', resetUrl);
    }

    await sendPasswordResetEmail({
      to: email,
      name: user.name || '',
      resetUrl,
    });

    return genericResponse;
  } catch (error) {
    console.error('API: Forgot password error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process password reset request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
