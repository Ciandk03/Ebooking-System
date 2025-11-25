import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as firestore from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { userService, movieService } from '../../../../services/database';

export const runtime = 'nodejs';

// Firestore collection for shows (showtimes)
const showsCollection = firestore.collection(db, 'shows');

// Helper: verify JWT from Authorization header
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const JWT_SECRET =
    process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

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

// POST /api/admin/showtimes - create a showtime
export async function POST(request: NextRequest) {
  console.log('API: POST /api/admin/showtimes - Create showtime');

  try {
    // 1) Auth + admin check
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const adminUser = await userService.getUserById(payload.userId);
    if (!adminUser || !adminUser.isAdmin) {
      console.log(
        'API: Non-admin attempted to create showtime:',
        payload.email,
      );
      return NextResponse.json(
        { success: false, error: 'Forbidden: admin only' },
        { status: 403 },
      );
    }

    // 2) Parse & validate body
    const body = await request.json();
    const {
      movieId,
      showroomId,
      startDateTime, // ISO string: 2025-12-24T19:30
      childTicketPrice,
      adultTicketPrice,
      seniorTicketPrice,
    } = body || {};

    const missing: string[] = [];
    if (!movieId) missing.push('movieId');
    if (!showroomId) missing.push('showroomId');
    if (!startDateTime) missing.push('startDateTime');
    if (childTicketPrice === undefined) missing.push('childTicketPrice');
    if (adultTicketPrice === undefined) missing.push('adultTicketPrice');
    if (seniorTicketPrice === undefined) missing.push('seniorTicketPrice');

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

    const childPriceNum = Number(childTicketPrice);
    const adultPriceNum = Number(adultTicketPrice);
    const seniorPriceNum = Number(seniorTicketPrice);

    if (
      Number.isNaN(childPriceNum) ||
      Number.isNaN(adultPriceNum) ||
      Number.isNaN(seniorPriceNum)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket prices must be numeric',
        },
        { status: 400 },
      );
    }

    // 3) Load movie (for duration + title)
    const movie = await movieService.getMovieById(movieId);
    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          error: 'Movie not found',
        },
        { status: 404 },
      );
    }

    if (!movie.duration || typeof movie.duration !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error:
            'Movie duration (in minutes) is required on the movie document',
        },
        { status: 400 },
      );
    }

    // 4) Load showroom to get seats
    const showroomRef = firestore.doc(db, 'showrooms', showroomId);
    const showroomSnap = await firestore.getDoc(showroomRef);

    if (!showroomSnap.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Showroom not found',
        },
        { status: 404 },
      );
    }

    const showroomData = showroomSnap.data() as any;
    const seats: string[] = Array.isArray(showroomData.seats)
      ? showroomData.seats
      : [];

    if (seats.length === 0) {
      console.warn(
        'API: Showroom has no seats array; availableSeats will be empty.',
      );
    }

    // 5) Compute start / end times
    const start = new Date(startDateTime);
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid startDateTime; must be a valid ISO date-time string',
        },
        { status: 400 },
      );
    }

    // end time = start + movie.duration minutes
    const end = new Date(start.getTime() + movie.duration * 60 * 1000);

    const dateStr = start.toISOString().slice(0, 10); // YYYY-MM-DD
    const startTimeStr = start.toTimeString().slice(0, 5); // HH:MM
    const endTimeStr = end.toTimeString().slice(0, 5); // HH:MM

    // 6) Build showtime document in `shows`
    const name = `${movie.title} - ${dateStr} ${startTimeStr}`;

    const showDoc = {
      name,
      movie: movieId,
      showroom: showroomId,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      availableSeats: seats,
      adultTicketPrice: adultPriceNum,
      childTicketPrice: childPriceNum,
      seniorTicketPrice: seniorPriceNum,
    };

    const showRef = await firestore.addDoc(showsCollection, showDoc);
    const showId = showRef.id;

    // 7) Update movie.shows array with this showtime id
    const movieRef = firestore.doc(db, 'movies', movieId);
    await firestore.updateDoc(movieRef, {
      shows: firestore.arrayUnion(showId),
      updatedAt: firestore.Timestamp.fromDate(new Date()),
    });

    // 8) Update showroom.shows array with this showtime id
    await firestore.updateDoc(showroomRef, {
      shows: firestore.arrayUnion(showId),
    });

    return NextResponse.json(
      {
        success: true,
        showId,
        show: {
          id: showId,
          ...showDoc,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('API: Error creating showtime:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create showtime',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
