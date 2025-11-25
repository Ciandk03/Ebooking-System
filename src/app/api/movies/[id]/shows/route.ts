import { NextRequest, NextResponse } from 'next/server';
import { showtimeService } from '../../../../../services/database';

export const runtime = 'nodejs';

// GET /api/movies/:id/shows
export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const movieParams = await context.params;
  const movieId = movieParams.id;
  console.log('API: GET /api/movies/[id]/shows - movieId =', movieId);

  if (!movieId) {
    return NextResponse.json(
      { success: false, error: 'Movie ID is required' },
      { status: 400 },
    );
  }

  try {
    const shows = await showtimeService.getShowtimesByMovieId(movieId);
    console.log("API: Successfully returned", shows.length, "shows for movie ID:", movieId);
    return NextResponse.json(
      {
        success: true,
        data: shows,
      },
      { status: 200 },
      
    );
  } catch (error: any) {
    console.error('API: Error fetching shows for movie:', movieId, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch showtimes',
        message: error?.message || 'Unknown error',
      },
      { status: 500 },
    );
  }
}
