import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest) {
	try {
		const token = request.cookies.get('auth-token')?.value;

		if (!token) {
			return NextResponse.json({ error: 'No token provided' }, { status: 401 });
		}

		// Verify JWT token
		const decoded = jwt.verify(token, JWT_SECRET) as any;

		if (!decoded.userId) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}

		const { name, phoneNumber } = await request.json();

		// Validate input
		if (!name || !phoneNumber) {
			return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
		}

		await dbConnect();

		// Update user
		const updatedUser = await User.findByIdAndUpdate(
			decoded.userId,
			{
				name: name.trim(),
				phoneNumber: phoneNumber.trim(),
				updatedAt: new Date(),
			},
			{ new: true }
		).select('-otp -otpExpiry');

		if (!updatedUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({
			user: {
				id: updatedUser._id,
				email: updatedUser.email,
				name: updatedUser.name,
				phoneNumber: updatedUser.phoneNumber,
				isVerified: updatedUser.isVerified,
				createdAt: updatedUser.createdAt,
				updatedAt: updatedUser.updatedAt,
			},
		});
	} catch (error) {
		console.error('Update profile error:', error);

		if (error instanceof jwt.JsonWebTokenError) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
