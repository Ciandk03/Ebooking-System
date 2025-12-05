import { NextRequest, NextResponse } from 'next/server';
import * as firestore from 'firebase/firestore';
import { showtimesCollection } from '../../../services/database';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest) {
  console.log('API: GET /api/showrooms - Fetching all showrooms');
  

  try {
    const snapshot = await firestore.getDocs(showtimesCollection);
    const showrooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        showrooms,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('API: Error fetching showrooms:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch showrooms',
        message: error?.message || 'Unknown error',
      },
      { status: 500 },
    );
  }
}