import { NextRequest, NextResponse } from 'next/server';
import { movieService, showtimeService, bookingService } from '../../../services/database';

// GET - Test all database connections and operations
export async function GET() {
  console.log('API: GET /api/test - Testing database connections and operations');
  
  const results = {
    firebase: false,
    movies: false,
    showtimes: false,
    bookings: false,
    errors: [] as string[]
  };
  
  try {
    // Tests
    console.log('Testing Firebase connection...');
    const movies = await movieService.getAllMovies();
    results.firebase = true;
    results.movies = true;
    console.log('Firebase connection successful');
    console.log(`Found ${movies.length} movies in database`);
    
    console.log('Testing showtimes...');
    const showtimes = await showtimeService.getAllShowtimes();
    results.showtimes = true;
    console.log(`Found ${showtimes.length} showtimes in database`);
    
    console.log('Testing bookings...');
    const bookings = await bookingService.getAllBookings();
    results.bookings = true;
    console.log(`Found ${bookings.length} bookings in database`);
    
    console.log('All database operations successful');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and operations test completed successfully',
      results,
      summary: {
        firebaseConnected: results.firebase,
        moviesCount: movies.length,
        showtimesCount: showtimes.length,
        bookingsCount: bookings.length
      }
    });
    
  } catch (error) {
    console.error('API: Database test failed:', error);
    results.errors.push(error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      {
        success: false,
        message: 'Database test failed',
        results,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create sample data for testing
export async function POST(request: NextRequest) {
  console.log('API: POST /api/test - Creating sample data');
  
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'create-sample-movie') {
      console.log('Creating sample movie...');
      
      const movieId = await movieService.createMovie({
        title: 'Sample Movie',
        poster: 'https://via.placeholder.com/300x450',
        rating: 8.5,
        details: 'This is a sample movie for testing purposes.',
        trailer: 'https://www.youtube.com/watch?v=sample',
        genres: ['Action', 'Drama'],
        currentlyRunning: true,
        comingSoon: false,
        duration: 120,
        releaseDate: '2024-01-01'
      });
      
      console.log(`Sample movie created with ID: ${movieId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Sample movie created successfully',
        data: { movieId }
      });
    }
    
    if (action === 'create-sample-showtime') {
      console.log('Creating sample showtime...');
      
      const { movieId } = body;
      if (!movieId) {
        return NextResponse.json(
          {
            success: false,
            error: 'movieId is required for creating showtime'
          },
          { status: 400 }
        );
      }
      
      const showtimeId = await showtimeService.createShowtime({
        movieId,
        date: '2024-12-25',
        time: '19:30',
        theater: 'Theater 1',
        availableSeats: 50,
        totalSeats: 50,
        price: 12.99
      });
      
      console.log(`Sample showtime created with ID: ${showtimeId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Sample showtime created successfully',
        data: { showtimeId }
      });
    }
    
    if (action === 'create-sample-booking') {
      console.log('Creating sample booking...');
      
      const { userId, movieId, showtimeId } = body;
      if (!userId || !movieId || !showtimeId) {
        return NextResponse.json(
          {
            success: false,
            error: 'userId, movieId, and showtimeId are required for creating booking'
          },
          { status: 400 }
        );
      }
      
      const bookingId = await bookingService.createBooking({
        userId,
        movieId,
        showtimeId,
        seats: ['A1', 'A2'],
        totalPrice: 25.98,
        status: 'pending',
        bookingDate: new Date()
      });
      
      console.log(`Sample booking created with ID: ${bookingId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Sample booking created successfully',
        data: { bookingId }
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Supported actions: create-sample-movie, create-sample-showtime, create-sample-booking'
      },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('API: Error creating sample data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create sample data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
