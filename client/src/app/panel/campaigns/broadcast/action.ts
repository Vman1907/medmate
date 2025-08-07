'use server';

import RequestError from '@/lib/RequestError';
import { Broadcast } from '@/schema/broadcastSchema';
import BroadcastService from '@/services/broadcast.service';

export const scheduleBroadcast = async (
	data: Broadcast & {
		forceSchedule?: boolean;
	}
) => {
	try {
		await BroadcastService.scheduleBroadcast(data);
	} catch (err) {
		if (err instanceof RequestError) {
			if (err.title === 'ALREADY_EXISTS') {
				throw new Error('Broadcast with this name already exists');
			}
			throw new Error(err.message);
		}
		throw new Error('Failed to schedule broadcast');
	}
};
