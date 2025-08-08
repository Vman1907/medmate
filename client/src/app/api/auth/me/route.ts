import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
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

		await dbConnect();

		// Find user by ID
		const user = await User.findById(decoded.userId).select('-otp -otpExpiry');

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json({
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
				phoneNumber: user.phoneNumber,
				isVerified: user.isVerified,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	} catch (error) {
		console.error('Get user error:', error);

		if (error instanceof jwt.JsonWebTokenError) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
