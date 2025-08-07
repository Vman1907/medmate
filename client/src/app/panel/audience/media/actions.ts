'use server';

import MediaService from '@/services/media.service';

export async function deleteMedia(id: string) {
	await MediaService.deleteMedia(id);
}
