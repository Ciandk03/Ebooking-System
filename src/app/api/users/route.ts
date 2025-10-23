import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/database';
import { encrypt, hashPassword, decrypt, encryptPaymentCard } from '../../../utils/encryption';
import { PaymentCard } from '../../../types/database';

//register user
export async function POST(request: NextRequest) {
    console.log('API: POST /api/users - Creating new user');

    try {
        const body = await request.json();
        console.log('API: User data received:', JSON.stringify(body, null, 2));
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'password'];
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
        
        // Encrypt password and payment info
        const hashedPassword = hashPassword(body.password);
        let encryptedPayment = undefined;
        
        console.log('API: Password being processed:', body.password ? '[PASSWORD PROVIDED]' : '[NO PASSWORD]');
        console.log('API: Hashed password:', hashedPassword);
        
        // Handle payment card encryption
        if (body.payment && typeof body.payment === 'object') {
            const paymentCard: PaymentCard = body.payment;
            console.log('API: Payment card data received:', {
                cardNumber: paymentCard.cardNumber ? '[CARD NUMBER PROVIDED]' : '[NO CARD NUMBER]',
                cardHolderName: paymentCard.cardHolderName ? '[CARD HOLDER PROVIDED]' : '[NO CARD HOLDER]',
                expiryMonth: paymentCard.expiryMonth || '[NO EXPIRY MONTH]',
                expiryYear: paymentCard.expiryYear || '[NO EXPIRY YEAR]',
                cvv: paymentCard.cvv ? '[CVV PROVIDED]' : '[NO CVV]',
                billingAddress: paymentCard.billingAddress ? '[BILLING ADDRESS PROVIDED]' : '[NO BILLING ADDRESS]'
            });
            
            encryptedPayment = encryptPaymentCard(paymentCard);
            console.log('API: Payment card encrypted successfully');
        } else {
            console.log('API: No payment card information provided');
        }
        
        const userId = await userService.createUser({
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: hashedPassword,
        address: body.address, // Store as string, will be parsed by app
        payment: encryptedPayment
        });
        
        console.log(`API: User created successfully with ID: ${userId}`);
        return NextResponse.json({
        success: true,
        data: { id: userId },
        message: 'User created successfully'
        }, { status: 201 });
        
    } catch (error) {
        console.error('API: Error creating user:', error);
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

// Get all users (for admin purposes)
export async function GET(request: NextRequest) {
    console.log('API: GET /api/users - Fetching all users');
    
    try {
        const users = await userService.getAllUsers();
        
        // Decrypt sensitive data for display
        const decryptedUsers = users.map(user => ({
            ...user,
            password: user.password ? '[ENCRYPTED]' : undefined,
            payment: user.payment ? '[ENCRYPTED]' : undefined,
        }));
        
        console.log(`API: Retrieved ${users.length} users`);
        return NextResponse.json({
            success: true,
            data: decryptedUsers,
            message: 'Users retrieved successfully'
        }, { status: 200 });
        
    } catch (error) {
        console.error('API: Error fetching users:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch users',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}