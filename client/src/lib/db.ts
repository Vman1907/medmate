import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medmate';

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface Cached {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose || { conn: null, promise: null };

if (!(global as any).mongoose) {
	(global as any).mongoose = cached;
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts);
	}

	try {
		console.log('Connecting to MongoDB');
		cached.conn = await cached.promise;
	} catch (e) {
		console.error('Error connecting to MongoDB', e);
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
