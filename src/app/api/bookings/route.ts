import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '../../../services/database';

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
    
    const bookingId = await bookingService.createBooking({
      userId: body.userId,
      movieId: body.movieId,
      showtimeId: body.showtimeId,
      seats: body.seats,
      totalPrice: body.totalPrice,
      status: body.status || 'pending',
      bookingDate: new Date(body.bookingDate || new Date())
    });
    
    console.log(`API: Booking created successfully with ID: ${bookingId}`);
    return NextResponse.json({
      success: true,
      data: { id: bookingId },
      message: 'Booking created successfully'
    }, { status: 201 });
    
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
