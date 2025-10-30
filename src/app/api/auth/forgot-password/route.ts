import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { userService } from '../../../../services/database';
import { sendPasswordResetEmail } from '../../../../utils/mailer';

// Ensure Node runtime so Nodemailer works in Next.js App Router
export const runtime = 'nodejs';

// In-memory token store (replace with DB/Firestore in production)
const RESET_TOKENS = new Map<string, { token: string; expires: number; userId: string }>();

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

    // 1) Look up user (do not leak existence in response)
    const user = await userService.getUserByEmail(email);

    // Always behave the same to the caller
    const genericResponse = NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
        ...(process.env.NODE_ENV === 'development' ? { dev: true } : {}),
      },
      { status: 200 }
    );

    // If no user, return generic success (avoid enumeration)
    if (!user) {
      console.log('API: Password reset request for non-existent email:', email);
      return genericResponse;
    }

    // 2) Generate token & store (1 hour TTL)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000;

    RESET_TOKENS.set(email, {
      token: resetToken,
      expires,
      userId: user.id,
    });

    console.log('API: Password reset token generated for user:', email);
    if (process.env.NODE_ENV === 'development') {
      console.log('API: Reset token (dev only):', resetToken);
    }

    // 3) Build reset URL
    const APP_URL = process.env.APP_URL || 'http://localhost:3000';
    // Change this path if your page is /reset-password (lowercase) instead of /ResetPassword
    const RESET_PAGE_PATH = process.env.RESET_PAGE_PATH || '/reset-password';

    const resetUrl = `${APP_URL}${RESET_PAGE_PATH}?token=${encodeURIComponent(
      resetToken
    )}&email=${encodeURIComponent(email)}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('API: Reset link (dev only):', resetUrl);
    }

    // 4) Send the reset email to the requester
    await sendPasswordResetEmail({
      to: email,
      name: user.name || '',
      resetUrl,
    });

    // 5) Return generic success
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
