import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/database';

//register user
export async function POST(request: NextRequest) {
    console.log('API: POST /api/users - Creating new user');

    try {
        const body = await request.json();
        console.log('API: User data received:', JSON.stringify(body, null, 2));
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'password', 'phone'];
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
        
        const movieId = await userService.createUser({
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: body.password,
        address: body.address,
        //for payment, and password, encrypt the data somehow
        payment: body.payment
        });
        
        console.log(`API: Movie created successfully with ID: ${movieId}`);
        return NextResponse.json({
        success: true,
        data: { id: movieId },
        message: 'Movie created successfully'
        }, { status: 201 });
        
    } catch (error) {
        console.error('API: Error creating movie:,'+error);
        return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
    }
}