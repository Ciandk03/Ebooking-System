import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';

function buildRedirect(request: NextRequest, status: string) {
  const target = new URL(`/Login?verified=${status}`, request.nextUrl.origin);
  return NextResponse.redirect(target);
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && value && 'toDate' in value && typeof (value as any).toDate === 'function') {
    return (value as any).toDate();
  }
  return null;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return buildRedirect(request, 'missing');
  }

  try {
    const user = await userService.getUserByVerificationToken(token);

    if (!user) {
      return buildRedirect(request, 'invalid');
    }

    if (user.active) {
      return buildRedirect(request, 'already');
    }

    const expiresAt = normalizeDate((user as any).verificationExpires);
    if (!expiresAt || expiresAt.getTime() < Date.now()) {
      return buildRedirect(request, 'expired');
    }

    await userService.updateUser(user.id, {
      active: true,
      verificationToken: null,
      verificationExpires: null,
      verifiedAt: new Date(),
    });

    return buildRedirect(request, '1');
  } catch (error) {
    console.error('API: Email verification failed', error);
    return buildRedirect(request, 'error');
  }
}

