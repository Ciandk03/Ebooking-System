import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../services/database';
import { encrypt, hashPassword, decrypt, encryptPaymentCard } from '../../../utils/encryption';
import { PaymentCard } from '../../../types/database';
import { sendVerificationEmail } from '../../../utils/mailer';
import { randomBytes } from 'crypto';
export const runtime = 'nodejs';

//register user
export async function POST(request: NextRequest) {
    console.log('API: POST /api/users - Creating new user');

    try {
        const body = await request.json();
        console.log('API: User data received:', JSON.stringify(body, null, 2));
        
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
        let encryptedPayment: string | null = null;
        
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
            encryptedPayment = null;
        }

        //make empty optional fields null instead of undefined
        if(!body.phone){
            body.phone = null;
        }
        if(!body.address) {
            body.address = null;
        }
        
        const verificationToken = randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

        const userId = await userService.createUser({
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: hashedPassword,
        address: body.address,
        payment: encryptedPayment,
        active: false,
        isAdmin: false,
        subscribeToPromotions: body.subscribeToPromotions,
        verificationToken,
        verificationExpires,
        verifiedAt: null
        });
        try {
          const verifyUrlBase = process.env.APP_URL || '';
          const verifyUrl = verifyUrlBase
            ? `${verifyUrlBase.replace(/\/$/, '')}/api/auth/verify?token=${verificationToken}`
            : `${request.nextUrl.origin}/api/auth/verify?token=${verificationToken}`;
          await sendVerificationEmail({
            to: body.email,
            name: body.name,
            verifyUrl
          });
          console.log('API: Verification email sent');
        } catch (mailErr) {
          console.error('API: Failed to send verification email:', mailErr);
        }
        console.log(`API: User created successfully with ID: ${userId}`);
        return NextResponse.json({
        success: true,
        data: { id: userId },
        message: 'User created successfully. Please verify your email to activate your account.'
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

// Get all users (for admin)
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