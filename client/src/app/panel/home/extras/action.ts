'use server';

import ExtraService from '@/services/extra.service';

export async function createFAQs(list: { title: string; info: string }[]) {
	await ExtraService.createFAQs(list);
}

export async function createTestimonials(
	list: { title: string; name: string; photo_url: string; description: string }[]
) {
	await ExtraService.createTestimonials(list);
}
