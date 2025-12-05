
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as firestore from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { userService } from '../../../../services/database';
import { sendPromotionEmail } from '../../../../utils/mailer';

export const runtime = 'nodejs';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role?: string;
    };
  } catch {
    return null;
  }
}

const promotionsCollection = firestore.collection(db, 'promotions');

export async function POST(request: NextRequest) {
  console.log('API: POST /api/admin/promotions - Create promotion & email subscribers');

  try {
    // Admin check
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const adminUser = await userService.getUserById(payload.userId);
    if (!adminUser || !adminUser.isAdmin) {
      console.log('API: Non-admin attempted to create promotion:', payload.email);
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403 },
      );
    }

    // Read and validate body
    const body = await request.json();
    const { code, startDate, endDate, discount } = body || {};

    const missing: string[] = [];
    if (!code) missing.push('code');
    if (!startDate) missing.push('startDate');
    if (!endDate) missing.push('endDate');
    if (discount === undefined || discount === null) missing.push('discount');

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields: missing,
        },
        { status: 400 },
      );
    }

    if (typeof discount !== 'number' || Number.isNaN(discount)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Discount must be a number',
        },
        { status: 400 },
      );
    }

    // Save promotion
    const now = firestore.Timestamp.fromDate(new Date());
    const docRef = await firestore.addDoc(promotionsCollection, {
      code,
      startDate,
      endDate,
      discount,
      createdAt: now,
      updatedAt: now,
      createdByUserId: adminUser.id,
    });

    console.log('API: Promotion created with ID:', docRef.id);

    // Fetch subs
    const allUsers = await userService.getAllUsers();
    const subscribers = allUsers.filter(
      (u: any) => u.subscribeToPromotions && u.email,
    );

    console.log(
      `API: Found ${subscribers.length} users subscribed to promotions`,
    );

    // Email subs
    const results = await Promise.all(
      subscribers.map(async (u: any) => {
        try {
          await sendPromotionEmail({
            to: u.email,
            name: u.name,
            code,
            discount,
            startDate,
            endDate,
          });
          return { email: u.email, ok: true };
        } catch (error) {
          console.error('API: Failed to send promo email to', u.email, error);
          return { email: u.email, ok: false };
        }
      }),
    );

    const sent = results.filter((r) => r.ok).length;
    const failed = results.length - sent;

    return NextResponse.json(
      {
        success: true,
        message: `Promotion created and ${sent} promotional emails sent (${failed} failed).`,
        data: { id: docRef.id, code, discount, startDate, endDate },
        emailStats: {
          totalSubscribers: subscribers.length,
          sent,
          failed,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('API: Error creating promotion:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create promotion',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
