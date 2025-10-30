import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '../../../utils/mailer';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing email configuration...');
    
    await sendPasswordResetEmail({
      to: 'cdkaisharis@gmail.com',
      name: 'Test User',
      resetUrl: 'http://localhost:3000/reset-password?token=test123',
    });

    console.log('Email sent successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully! Check your inbox.' 
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    }, { status: 500 });
  }
}
