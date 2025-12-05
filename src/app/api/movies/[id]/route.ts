import { NextRequest, NextResponse } from 'next/server';
import { movieService } from '../../../../services/database';

// GET - Get movie by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`API: GET /api/movies/${id} - Fetching movie by ID`);
  
  try {
    const movie = await movieService.getMovieById(id);
    
    if (!movie) {
      console.log(`API: Movie with ID ${id} not found`);
      return NextResponse.json(
        {
          success: false,
          error: 'Movie not found'
        },
        { status: 404 }
      );
    }
    
    console.log(`API: Successfully returned movie: ${movie.title}`);
    return NextResponse.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('API: Error fetching movie:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update movie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`API: PUT /api/movies/${id} - Updating movie`);
  
  try {
    const body = await request.json();
    console.log('API: Update data received:', JSON.stringify(body, null, 2));
    
    await movieService.updateMovie(id, body);
    
    console.log(`API: Movie with ID ${id} updated successfully`);
    return NextResponse.json({
      success: true,
      message: 'Movie updated successfully'
    });
  } catch (error) {
    console.error('API: Error updating movie:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete movie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`API: DELETE /api/movies/${id} - Deleting movie`);
  
  try {
    await movieService.deleteMovie(id);
    
    console.log(`API: Movie with ID ${id} deleted successfully`);
    return NextResponse.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('API: Error deleting movie:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete movie',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
