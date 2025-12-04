import { NextRequest, NextResponse } from 'next/server';
import { showService } from '../../../../services/database';

//GET - get a showtime by its ID

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`API: GET /api/showtimes/${id} - Fetching showtime by ID`);
  
  try {
    const show = await showService.getShowById(id);
    
    if (!show) {
      console.log(`API: Show with ID ${id} not found`);
      return NextResponse.json(
        {
          success: false,
          error: 'Show not found'
        },
        { status: 404 }
      );
    }
    
    console.log(`API: Successfully returned show`);
    return NextResponse.json({
      success: true,
      data: show
    });
  } catch (error) {
    console.error('API: Error fetching show:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch show',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}