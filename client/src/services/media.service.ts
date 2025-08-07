import api from '@/lib/api';
import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { Media } from '@/types/media';
import UploadService from './upload.service';

export default class MediaService {
	static async getMedias() {
		try {
			const data = await apiClient.get<{ list: Media[] }>('/media', {
				tags: [REVALIDATE_TAGS.MEDIA],
			});
			return data.list;
		} catch (err) {
			return [];
		}
	}

	static async deleteMedia(id: string) {
		await apiClient.delete(`/media/${id}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.MEDIA);
	}

	static async downloadMedia(id: string) {
		await UploadService.downloadFile(`/media/${id}/download`);
	}

	static async uploadMedia(
		file: File,
		filename: string,
		onUploadProgress?: (progress: number) => void
	) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', filename);
		const { data } = await api.post(`/media`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				onUploadProgress?.(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1)));
			},
		});
		return data.media;
	}
}
