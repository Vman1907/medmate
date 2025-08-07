import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';

export default class UserService {
	static async listMessageTags() {
		try {
			const { tags } = await apiClient.get<{
				tags: string[];
			}>(`/users/message-tags`, {
				tags: [REVALIDATE_TAGS.USER + ':message-tags'],
			});
			return tags;
		} catch (e) {
			return [];
		}
	}

	static async createMessageTags(tags: string[]) {
		await apiClient.post(`/users/message-tags`, {
			tags,
		});
		apiClient.revalidateTag(REVALIDATE_TAGS.USER + ':message-tags');
		return tags;
	}

	static async toggleGoogleConnection(media_drive_backup:boolean) {
		await apiClient.post(`/users/google-drive`, {
			media_drive_backup,
		});

		
	}
}
