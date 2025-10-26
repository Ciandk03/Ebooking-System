import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Edit Profile API is working correctly',
    endpoints: {
      'GET /api/users/profile': 'Fetch user profile data',
      'PUT /api/users/profile': 'Update user profile data'
    },
    features: [
      'User authentication via JWT tokens',
      'Profile data fetching with encrypted payment card decryption',
      'Profile updates with validation',
      'Password change with current password verification',
      'Payment card management (max 4 cards)',
      'Address management (max 1 address)',
      'Promotions subscription toggle',
      'Email notifications for profile changes',
      'Data encryption for sensitive information'
    ]
  });
}
