import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';
import { decrypt, decryptPaymentCard, maskCardNumber } from '../../../../utils/encryption';
import { PaymentCard } from '../../../../types/database';

// Get user by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    console.log(`API: GET /api/users/${params.id} - Fetching user`);
    
    try {
        const user = await userService.getUserById(params.id);
        
        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            }, { status: 404 });
        }
        
        // Decrypt sensitive data if needed (in production, you'd want proper access control)
        let maskedPayment = undefined;
        if (user.payment) {
            try {
                const decryptedCard: PaymentCard = decryptPaymentCard(user.payment);
                maskedPayment = {
                    cardNumber: maskCardNumber(decryptedCard.cardNumber),
                    cardHolderName: decryptedCard.cardHolderName,
                    expiryMonth: decryptedCard.expiryMonth,
                    expiryYear: decryptedCard.expiryYear,
                    cvv: '***',
                    billingAddress: decryptedCard.billingAddress
                };
            } catch (error) {
                console.error('Error decrypting payment card:', error);
                maskedPayment = '[ENCRYPTED - DECRYPTION FAILED]';
            }
        }

        const decryptedUser = {
            ...user,
            password: user.password ? '[ENCRYPTED]' : undefined,
            payment: maskedPayment,
        };
        
        console.log(`API: Retrieved user: ${user.email}`);
        return NextResponse.json({
            success: true,
            data: decryptedUser,
            message: 'User retrieved successfully'
        }, { status: 200 });
        
    } catch (error) {
        console.error('API: Error fetching user:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch user',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Update user by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    console.log(`API: PUT /api/users/${params.id} - Updating user`);
    
    try {
        const body = await request.json();
        console.log('API: User update data received:', JSON.stringify(body, null, 2));
        
        // If password is being updated, hash it
        if (body.password) {
            const { hashPassword } = await import('../../../../utils/encryption');
            body.password = hashPassword(body.password);
            console.log('API: Password updated and hashed');
        }
        
        // If payment info is being updated, encrypt it
        if (body.payment && typeof body.payment === 'object') {
            const { encryptPaymentCard } = await import('../../../../utils/encryption');
            body.payment = encryptPaymentCard(body.payment as PaymentCard);
            console.log('API: Payment card updated and encrypted');
        }
        
        await userService.updateUser(params.id, body);
        
        console.log(`API: User updated successfully: ${params.id}`);
        return NextResponse.json({
            success: true,
            message: 'User updated successfully'
        }, { status: 200 });
        
    } catch (error) {
        console.error('API: Error updating user:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update user',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Delete user by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    console.log(`API: DELETE /api/users/${params.id} - Deleting user`);
    
    try {
        await userService.deleteUser(params.id);
        
        console.log(`API: User deleted successfully: ${params.id}`);
        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        }, { status: 200 });
        
    } catch (error) {
        console.error('API: Error deleting user:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete user',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
