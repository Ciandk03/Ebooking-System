import { NextRequest, NextResponse } from 'next/server';
import * as firestore from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { bookingService, userService, movieService } from '../../../services/database';

import { sendBookingConfirmationEmail } from '../../../utils/mailer';

export const runtime = 'nodejs';

// GET /api/bookings - Get all bookings or filter by userId
export async function GET(request: NextRequest) {
  console.log('API: GET /api/bookings - Fetching bookings');

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let bookings;
    if (userId) {
      console.log(`API: Fetching bookings for user ID: ${userId}`);
      bookings = await bookingService.getBookingsByUserId(userId);
    } else {
      console.log('API: Fetching all bookings');
      bookings = await bookingService.getAllBookings();
    }

    console.log(`API: Successfully returned ${bookings.length} bookings`);
    return NextResponse.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('API: Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  console.log('API: POST /api/bookings - Creating new booking');

  try {
    const body = await request.json();
    console.log('API: Booking data received:', JSON.stringify(body, null, 2));

    // Validate required fields
    const requiredFields = ['userId', 'movieId', 'showtimeId', 'seats', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      console.log(`API: Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }
    const seatsArray: string[] = Array.isArray(body.seats) ? body.seats : [];

    const bookingId = await bookingService.createBooking({
      userId: body.userId,
      movieId: body.movieId,
      showtimeId: body.showtimeId,
      seats: seatsArray,
      totalPrice: body.totalPrice,
      status: body.status || 'pending',
      bookingDate: new Date(body.bookingDate || new Date()),
    });

    console.log(`API: Booking created successfully with ID: ${bookingId}`);

    try {
      if (seatsArray.length > 0) {
        const showRef = firestore.doc(db, 'shows', body.showtimeId);
        await firestore.updateDoc(showRef, {
          availableSeats: firestore.arrayRemove(...seatsArray),
          updatedAt: firestore.Timestamp.fromDate(new Date()),
        });
        console.log(
          `API: Updated show ${body.showtimeId} availableSeats (reserved seats: ${seatsArray.join(
            ', ',
          )})`,
        );
      }
    } catch (err) {
      // Booking is created, but we failed to update the show document.
      // Log a warning but still return success so the user isn't blocked.
      console.error(
        'API: Warning – booking created but failed to update show.availableSeats',
        err,
      );
    }

    // Try to send confirmation email (non-blocking)
    try {
      const user = await userService.getUserById(body.userId);
      let movieTitle: string | undefined;

      try {
        const movie = await movieService.getMovieById(body.movieId);
        movieTitle = movie?.title;
      } catch (err) {
        console.error('API: Failed to fetch movie for confirmation email', err);
      }

      if (user && user.email) {
        await sendBookingConfirmationEmail({
          to: user.email,
          name: user.name,
          bookingId,
          movieTitle,
          totalPrice: body.totalPrice,
          seats: seatsArray,
        });

        console.log(`API: Booking confirmation email sent to ${user.email}`);
      } else {
        console.warn(
          `API: Skipping booking confirmation email; user not found or missing email for userId=${body.userId}`,
        );
      }
    } catch (err) {
      console.error('API: Failed to send booking confirmation email', err);
      // Do not throw here – booking itself has already succeeded.
    }


    return NextResponse.json(
      {
        success: true,
        data: { id: bookingId },
        message: 'Booking created successfully',
      },
      { status: 201 },
    );

  } catch (error) {
    console.error('API: Error creating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
