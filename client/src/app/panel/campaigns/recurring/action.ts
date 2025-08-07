'use server';

import { Recurring } from '@/schema/broadcastSchema';
import RecurringService from '@/services/recurring.service';

export async function toggleRecurring(campaignId: string) {
	const data = await RecurringService.toggleRecurring(campaignId);
	return data;
}

export async function deleteRecurring(campaignId: string) {
	await RecurringService.deleteRecurring(campaignId);
}

export async function editRecurring(id: string, data: Recurring) {
	await RecurringService.editRecurring({ ...data, id });
}

export async function createRecurring(data: Recurring) {
	await RecurringService.createRecurring(data);
}
