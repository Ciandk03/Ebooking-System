// src/app/api/promotions/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as firestore from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { userService } from '../../../../services/database';

export const runtime = 'nodejs';

const promotionsCollection = firestore.collection(db, 'promotions');

export async function POST(request: NextRequest) {
  console.log('API: POST /api/promotions/apply');
  try {
    const body = await request.json();
    const { userId, code, totalPrice } = body || {};

    if (!userId || !code || typeof totalPrice !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userId, code, totalPrice',
        },
        { status: 400 },
      );
    }

    const trimmedCode = String(code).trim().toUpperCase();

    // 1. Check user + subscription
    const user = await userService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    if (!user.subscribeToPromotions) {
      return NextResponse.json(
        {
          success: false,
          error:
            'This account is not subscribed to promotions. Enable promotional emails in your profile to use promo codes.',
        },
        { status: 403 },
      );
    }

    // 2. Find promotion by code
    const q = firestore.query(
      promotionsCollection,
      firestore.where('code', '==', trimmedCode),
    );
    const snapshot = await firestore.getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          error: 'Promo code not found or no longer available.',
        },
        { status: 404 },
      );
    }

    const promoDoc = snapshot.docs[0].data() as any;
    const discount = Number(promoDoc.discount) || 0;
    const startDateStr = promoDoc.startDate as string | undefined; // "2025-12-01"
    const endDateStr = promoDoc.endDate as string | undefined;

    // 3. Validate dates (if present)
    const now = new Date();
    let validByDate = true;

    if (startDateStr) {
      const start = new Date(`${startDateStr}T00:00:00`);
      if (now < start) validByDate = false;
    }

    if (endDateStr) {
      const end = new Date(`${endDateStr}T23:59:59`);
      if (now > end) validByDate = false;
    }

    if (!validByDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'This promo code is not currently valid.',
        },
        { status: 400 },
      );
    }

    // 4. Compute discount
    const base = Number(totalPrice) || 0;
    if (base <= 0 || !Number.isFinite(base)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid base total for promotion.',
        },
        { status: 400 },
      );
    }

    const discountAmount = Number((base * (discount / 100)).toFixed(2));
    const finalTotal = Number(Math.max(0, base - discountAmount).toFixed(2));

    console.log(
      `API: Promo applied code=${trimmedCode}, discount=${discount}%, base=${base}, final=${finalTotal}`,
    );

    return NextResponse.json({
      success: true,
      data: {
        code: trimmedCode,
        discountPercent: discount,
        discountAmount,
        finalTotal,
      },
    });
  } catch (err) {
    console.error('API: Error applying promotion:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to apply promotion',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
