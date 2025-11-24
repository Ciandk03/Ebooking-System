import { NextRequest, NextResponse } from 'next/server';
import { showroomService, theaterService } from '../../../../../../services/database';
export const runtime = 'nodejs';

// GET - Get theater showtimes by movie

export async function GET(
  req: Request,
  { params }: { params: { theaterId: string; movieId: string } }
) {
  const { theaterId, movieId } = params;

  try {
    const showtimes = await theaterService.getTheaterShowtimesFromMovies(theaterId, movieId);

    return NextResponse.json(
      { theaterId, movieId, showtimes },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to fetch showtimes' },
      { status: 500 }
    );
  }
}
