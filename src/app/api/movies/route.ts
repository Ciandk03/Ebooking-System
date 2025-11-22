import { NextRequest, NextResponse } from 'next/server';
import { movieService } from '../../../services/database';

// GET /api/movies - Get all movies
export async function GET() {
  console.log('API: GET /api/movies - Fetching all movies');
  
  try {
    const movies = await movieService.getAllMovies();
    
    console.log(`API: Successfully returned ${movies.length} movies`);
    return NextResponse.json({
      success: true,
      data: movies,
      count: movies.length
    });
  } catch (error) {
    console.error('API: Error fetching movies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch movies',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/movies - Create a new movie
export async function POST(request: NextRequest) {
  console.log('API: POST /api/movies - Creating new movie');
  
  try {
    const body = await request.json();
    console.log('API: Movie data received:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'poster', 'rating', 'details', 'genres'];
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
    
    const movieId = await movieService.createMovie({
      title: body.title,
      poster: body.poster,
      rating: body.rating,
      details: body.details,
      trailer: body.trailer || '',
      genres: body.genres,
      currentlyRunning: body.currentlyRunning || false,
      comingSoon: body.comingSoon || false,
      duration: body.duration || 120,
      releaseDate: body.releaseDate || new Date().toISOString().split('T')[0],
      cast: body.cast || [],
      director: body.director || '',
      producer: body.producer || ''
    });
    
    console.log(`API: Movie created successfully with ID: ${movieId}`);
    return NextResponse.json({
      success: true,
      data: { id: movieId },
      message: 'Movie created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('API: Error creating movie:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
