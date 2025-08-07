import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import RequestError from '@/lib/RequestError';
import { MessageLink } from '@/types/message-links';
import UploadService from './upload.service';
function formatMessageLink(item: any): MessageLink {
	return {
		createdAt: item.createdAt ?? new Date(),
		updatedAt: item.updatedAt ?? new Date(),
		code: item.code ?? '',
		deep_link_url: item.deep_link_url ?? '',
		prefilled_message: item.prefilled_message ?? '',
		qr_image_url: item.qr_image_url ?? '',
		id: item.id ?? '',
	};
}

export default class MessageLinkService {
	static async createMessageLink({ message, count }: { message: string; count: number }) {
		await apiClient.post('/message-links', {
			message,
			count,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.MESSAGE_LINKS);
	}

	static async getMessageLinks() {
		try {
			const { results } = await apiClient.get<{ results: any[] }>('/message-links', {
				tags: [REVALIDATE_TAGS.MESSAGE_LINKS],
			});
			return {
				success: true,
				data: results.map(formatMessageLink),
				error: '',
			};
		} catch (error) {
			return {
				success: false,
				data: [],
				error: error instanceof RequestError ? error.getMessage() : 'Unknown error',
			};
		}
	}

	static async bulkDeleteMessageLink(ids: string[]) {
		await apiClient.post(`/message-links/delete`, {
			ids,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.MESSAGE_LINKS);
	}

	static async downloadQrCode(ids: string[]) {
		await UploadService.downloadFile(`/message-links/download-qr-code`, `Qr Images.zip`, 'POST', {
			ids,
		});
	}

	static async deleteMessageLink(id: string) {
		await apiClient.delete(`/message-links/${id}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.MESSAGE_LINKS);
	}

	static async exportLinks(ids: string[]) {
		await UploadService.downloadFile(
			`/message-links/export`,
			`Link_Export_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`,
			'POST',
			{
				ids,
			}
		);
	}

	static async editLink(id: string, message: string) {
		await apiClient.patch(`/message-links/${id}`, {
			message,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.MESSAGE_LINKS);
	}
}
