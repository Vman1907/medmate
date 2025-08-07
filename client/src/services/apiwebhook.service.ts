import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';

type APIKey = {
	id: string;
	name: string;
	device: string;
	createdAt: string;
};

type Webhook = {
	id: string;
	name: string;
	device: string;
	createdAt: string;
	url: string;
};

export default class APIWebhookService {
	static async listKeys() {
		const data = await apiClient.get<{
			list: APIKey[];
		}>('/api-keys', {
			tags: [REVALIDATE_TAGS.API_KEYS],
		});
		return data.list.map((list) => {
			return {
				id: list.id ?? '',
				name: list.name ?? '',
				device: list.device ?? '',
				createdAt: list.createdAt ?? '',
			};
		});
	}

	static async createApiKey(name: string, device: string) {
		const data = await apiClient.post<{
			token: string;
		}>('/api-keys', {
			name,
			device,
		});

		return data.token as string;
	}

	static async RegenerateAPIKey(id: string) {
		const data = await apiClient.post<{
			token: string;
		}>(`/api-keys/${id}/regenerate-token`);

		return data.token as string;
	}

	static async createWebhook(name: string, device: string, url: string) {
		await apiClient.post('/api-keys/webhooks', {
			name,
			device,
			url,
		});
		apiClient.revalidateTag(REVALIDATE_TAGS.WEBHOOKS);
	}

	static async listWebhook() {
		const data = await apiClient.get<{
			list: Webhook[];
		}>('/api-keys/webhooks');
		return data.list.map((list) => {
			return {
				id: list.id ?? '',
				name: list.name ?? '',
				device: list.device ?? '',
				created_at: list.createdAt ?? '',
				url: list.url ?? '',
			};
		});
	}

	static async deleteApiKey(id: string) {
		await apiClient.delete(`/api-keys/${id}`);
		apiClient.revalidateTag(REVALIDATE_TAGS.API_KEYS);
	}

	static async deleteWebhook(id: string) {
		await apiClient.delete(`/api-keys/webhooks/${id}`);
		apiClient.revalidateTag(REVALIDATE_TAGS.WEBHOOKS);
	}

	static async validateWebhook(id: string) {
		await apiClient.post(`/api-keys/webhooks/${id}/validate`);
	}
}
