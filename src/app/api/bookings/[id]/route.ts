import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '../../../../services/database';

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`API: PUT /api/bookings/${id} - Updating booking status`);
  
  try {
    const body = await request.json();
    console.log('API: Update data received:', JSON.stringify(body, null, 2));
    
    const { status } = body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      console.log('API: Invalid status provided');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status. Must be one of: pending, confirmed, cancelled'
        },
        { status: 400 }
      );
    }
    
    await bookingService.updateBookingStatus(id, status);
    
    console.log(`API: Booking with ID ${id} status updated to ${status}`);
    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('API: Error updating booking status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update booking status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
