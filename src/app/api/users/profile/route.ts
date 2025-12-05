import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';
import { decryptPaymentCard, maskCardNumber } from '../../../../utils/encryption';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// GET user profile
export async function GET(request: NextRequest) {
  console.log('API: GET /api/users/profile - Fetching user profile');

  try {
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Invalid or missing token'
      }, { status: 401 });
    }

    const user = await userService.getUserById(tokenData.userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Decrypt payment cards
    let paymentCards: any[] = [];

    // Handle new array format
    if (user.paymentMethods && Array.isArray(user.paymentMethods)) {
      user.paymentMethods.forEach(encryptedCard => {
        try {
          const decryptedCard = decryptPaymentCard(encryptedCard);
          paymentCards.push({
            ...decryptedCard,
            cardNumber: maskCardNumber(decryptedCard.cardNumber),
            cvv: '***'
          });
        } catch (error) {
          console.error('Error decrypting a payment card:', error);
        }
      });
    }
    // Fallback to old single card format if no array
    else if (user.payment) {
      try {
        const decryptedCard = decryptPaymentCard(user.payment);
        paymentCards = [{
          ...decryptedCard,
          cardNumber: maskCardNumber(decryptedCard.cardNumber),
          cvv: '***'
        }];
      } catch (error) {
        console.error('Error decrypting payment card:', error);
      }
    }

    // Return data without sensitive info
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      paymentCards: paymentCards as any[],
      subscribeToPromotions: user.subscribeToPromotions || false,
      isAdmin: user.isAdmin,

      role: user.isAdmin ? 'admin' : 'user'
    };

    console.log('API: Profile fetched successfully for user:', user.email);

    return NextResponse.json({
      success: true,
      data: userProfile,
      message: 'Profile fetched successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('API: Get profile error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  console.log('API: PUT /api/users/profile - Updating user profile');

  try {
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Invalid or missing token'
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, paymentCards, currentPassword, newPassword, subscribeToPromotions } = body;

    console.log('API: Profile update request for user:', tokenData.email);

    // Get current user data
    const user = await userService.getUserById(tokenData.userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Name is required'
      }, { status: 400 });
    }

    // Validate address constraint
    if (address && typeof address !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Address must be a string'
      }, { status: 400 });
    }

    // Validate payment cards constraint
    if (paymentCards && Array.isArray(paymentCards) && paymentCards.length > 4) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 4 payment cards allowed'
      }, { status: 400 });
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({
          success: false,
          error: 'Current password is required to change password'
        }, { status: 400 });
      }

      // Verify current password
      const { hashPassword } = await import('../../../../utils/encryption');
      const hashedCurrentPassword = hashPassword(currentPassword);
      if (hashedCurrentPassword !== user.password) {
        return NextResponse.json({
          success: false,
          error: 'Current password is incorrect'
        }, { status: 400 });
      }

      // Validate new password
      if (newPassword.length < 8) {
        return NextResponse.json({
          success: false,
          error: 'New password must be at least 8 characters long'
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      phone: phone || null,
      address: address || null,
      subscribeToPromotions: subscribeToPromotions !== null ? subscribeToPromotions : null
    };

    // Handle password update
    if (newPassword) {
      const { hashPassword } = await import('../../../../utils/encryption');
      updateData.password = hashPassword(newPassword);
    }

    // Handle payment cards update
    if (paymentCards && Array.isArray(paymentCards)) {
      const { encryptPaymentCard } = await import('../../../../utils/encryption');

      if (paymentCards.length === 0) {
        updateData.paymentMethods = [];
        updateData.payment = null; // Clear legacy field too
      } else {
        // Encrypt all cards
        const encryptedCards = paymentCards.map((card: any) => encryptPaymentCard(card));
        updateData.paymentMethods = encryptedCards;

        // Update legacy field with the first card for backward compatibility
        updateData.payment = encryptedCards[0];
      }
    }

    // Update user in database
    await userService.updateUser(tokenData.userId, updateData);

    console.log('API: Profile updated successfully for user:', tokenData.email);

    // Send email notification about profile change
    try {
      const { sendProfileChangeEmail } = await import('../../../../utils/mailer');
      await sendProfileChangeEmail({
        to: user.email,
        name: user.name
      });
      console.log('API: Profile change notification email sent');
    } catch (mailError) {
      console.error('API: Failed to send profile change email:', mailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('API: Update profile error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
