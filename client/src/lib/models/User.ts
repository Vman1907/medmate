import mongoose from 'mongoose';

export interface IUser {
	email: string;
	phoneNumber: string;
	name: string;
	otp?: string;
	otpExpiry?: Date;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			unique: true,
		},
		name: {
			type: String,
			trim: true,
		},
		otp: {
			type: String,
			default: null,
		},
		otpExpiry: {
			type: Date,
			default: null,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
