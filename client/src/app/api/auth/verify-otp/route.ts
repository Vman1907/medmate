import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const { email, otp } = await request.json();

		// Validate required fields
		if (!email || !otp) {
			return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
		}

		// Find user by email
		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Check if OTP exists and is not expired
		if (!user.otp || !user.otpExpiry) {
			return NextResponse.json(
				{ error: 'No OTP found. Please request a new OTP' },
				{ status: 400 }
			);
		}

		// Check if OTP is expired
		if (new Date() > user.otpExpiry) {
			return NextResponse.json(
				{ error: 'OTP has expired. Please request a new OTP' },
				{ status: 400 }
			);
		}

		// Verify OTP
		if (user.otp !== otp) {
			return NextResponse.json({ error: 'Invalid OTP. Please try again' }, { status: 400 });
		}

		// Clear OTP after successful verification
		user.otp = null;
		user.otpExpiry = null;
		user.isVerified = true;
		await user.save();

		// Generate JWT token
		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				name: user.name,
			},
			JWT_SECRET,
			{ expiresIn: '7d' }
		);

		// Set HTTP-only cookie
		const response = NextResponse.json(
			{
				message: 'Login successful',
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					phoneNumber: user.phoneNumber,
					isVerified: user.isVerified,
				},
			},
			{ status: 200 }
		);

		// Set secure cookie
		response.cookies.set('auth-token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: '/',
		});

		return response;
	} catch (error) {
		console.error('Verify OTP error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
