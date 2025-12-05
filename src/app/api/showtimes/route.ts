import { NextRequest, NextResponse } from 'next/server';
import { showtimeService } from '../../../services/database';

// GET - Get all showtimes or filter by movieId
export async function GET(request: NextRequest) {
  console.log('API: GET /api/showtimes - Fetching showtimes');
  
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    
    let showtimes;
    if (movieId) {
      console.log(`API: Fetching showtimes for movie ID: ${movieId}`);
      showtimes = await showtimeService.getShowtimesByMovieId(movieId);
    } else {
      console.log('API: Fetching all showtimes');
      showtimes = await showtimeService.getAllShowtimes();
    }
    
    console.log(`API: Successfully returned ${showtimes.length} showtimes`);
    return NextResponse.json({
      success: true,
      data: showtimes,
      count: showtimes.length
    });
  } catch (error) {
    console.error('API: Error fetching showtimes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch showtimes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/showtimes - Create a new showtime
export async function POST(request: NextRequest) {
  console.log('API: POST /api/showtimes - Creating new showtime');
  
  try {
    const body = await request.json();
    console.log('API: Showtime data received:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const requiredFields = ['movieId', 'date', 'time', 'showroom', 'availableSeats', 'totalSeats', 'price'];
    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);
    
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
    
    const showtimeId = await showtimeService.createShowtime({
      movieId: body.movieId,
      date: body.date,
      time: body.time,
      showroom: body.theater,
      availableSeats: body.availableSeats,
      totalSeats: body.totalSeats,
      price: body.price
    });
    
    console.log(`API: Showtime created successfully with ID: ${showtimeId}`);
    return NextResponse.json({
      success: true,
      data: { id: showtimeId },
      message: 'Showtime created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('API: Error creating showtime:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create showtime',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
