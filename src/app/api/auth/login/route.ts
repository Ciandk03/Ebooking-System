import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../services/database';
import { hashPassword } from '../../../../utils/encryption';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

export async function POST(request: NextRequest) {
    console.log('API: POST /api/auth/login - User login attempt');

    try {
        const body = await request.json();
        const { email, password, rememberMe } = body;
        
        console.log('API: Login attempt for email:', email);
        
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: 'Email and password are required'
            }, { status: 400 });
        }

        // Find user by email
        const user = await userService.getUserByEmail(email);
        
        if (!user) {
            console.log('API: User not found for email:', email);
            return NextResponse.json({
                success: false,
                error: 'Invalid email or password'
            }, { status: 401 });
        }

        if (!user.password) {
            console.log('API: No password set for user:', email);
            return NextResponse.json({
                success: false,
                error: 'No password set. Please contact support.'
            }, { status: 401 });
        }

        if (!user.active) {
            console.log('API: Inactive (unverified) user attempted login:', email);
            return NextResponse.json({
                success: false,
                error: 'Please verify your email before signing in.'
            }, { status: 403 });
        }

        // Verify password
        const hashedInputPassword = hashPassword(password);
        const isPasswordValid = hashedInputPassword === user.password;
        
        if (!isPasswordValid) {
            console.log('API: Invalid password for user:', email);
            return NextResponse.json({
                success: false,
                error: 'Invalid email or password'
            }, { status: 401 });
        }

        // Generate JWT token
        const tokenExpiry = rememberMe ? '30d' : '1d';
        
        const derivedRole = (user as any).isAdmin ? 'admin' : ((user as any).role || 'user');

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: derivedRole
            },
            JWT_SECRET,
            { expiresIn: tokenExpiry }
        );

        console.log('API: Login successful for user:', email);
        
        // Return user data without sensitive info
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            
            isAdmin: (user as any).isAdmin || false,
            role: derivedRole,
            phone: user.phone,
            address: user.address
        };

        return NextResponse.json({
            success: true,
            data: {
                user: userData,
                token: token
            },
            message: 'Login successful'
        }, { status: 200 });

    } catch (error) {
        console.error('API: Login error:', error);
        return NextResponse.json({
            success: false,
            error: 'Login failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
