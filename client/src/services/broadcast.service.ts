import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { Broadcast } from '@/schema/broadcastSchema';
import UploadService from './upload.service';

type BroadcastReport = {
	broadcast_id: string;
	name: string;
	description: string;
	template_name: string;
	status: 'ACTIVE' | 'PAUSED';
	sent: number;
	failed: number;
	pending: number;
	isPaused: boolean;
	createdAt: string;
	startDate: string;
};

type ButtonResponseReport = {
	button_text: string;
	recipient: string;
	responseAt: string;
	name: string;
	email: string;
};

export default class BroadcastService {
	static async scheduleBroadcast(
		data: Broadcast & {
			forceSchedule?: boolean;
		}
	) {
		await apiClient.post(`/broadcast/schedule`, {
			name: data.name,
			description: data.description,
			template_id: data.template_id,
			template_name: data.template_name,
			to: data.recipients_from === 'numbers' ? data.to : [],
			labels: data.recipients_from === 'tags' ? data.labels : [],
			broadcast_options: data.broadcast_options,
			...(data.body && { body: data.body }),
			...(data.carousel && { carousel: data.carousel }),
			...(data.buttons && { buttons: data.buttons }),
			...(data.header && data.header.type !== 'NONE' && { header: data.header }),
			forceSchedule: data.forceSchedule || false,
			...(data.warning && { warning: data.warning }),
		});

		await apiClient.revalidateTag(REVALIDATE_TAGS.BROADCAST);
	}

	static async broadcastReport() {
		try {
			const data = await apiClient.get<{ reports: BroadcastReport[] }>(`/broadcast/reports`, {
				tags: [REVALIDATE_TAGS.BROADCAST],
			});
			return data.reports;
		} catch (err) {
			return [];
		}
	}

	static async pauseBroadcast(broadcastId: string) {
		try {
			await apiClient.post(`/broadcast/${broadcastId}/pause`);
			await apiClient.revalidateTag(REVALIDATE_TAGS.BROADCAST);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resumeBroadcast(broadcastId: string) {
		await apiClient.post(`/broadcast/${broadcastId}/resume`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.BROADCAST);
	}

	static async deleteBroadcast(broadcastId: string) {
		await apiClient.post(`/broadcast/${broadcastId}/delete`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.BROADCAST);
	}

	static async resendFailedBroadcast(broadcastId: string) {
		await apiClient.post(`/broadcast/${broadcastId}/resend`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.BROADCAST);
	}

	static async downloadBroadcast(broadcastId: string) {
		await UploadService.downloadFile(`/broadcast/${broadcastId}/download`, 'Campaign Report.csv');
	}

	static async buttonResponseReport({
		campaignId,
		exportCSV,
	}: {
		campaignId: string;
		exportCSV?: boolean;
	}) {
		if (!exportCSV) {
			try {
				const data = await apiClient.getWithoutCache<{ responses: ButtonResponseReport[] }>(
					`/broadcast/${campaignId}/button-responses`
				);
				return data.responses;
			} catch (err) {
				return null;
			}
		} else {
			await UploadService.downloadFile(
				`/broadcast/${campaignId}/button-responses?export_csv=true`,
				'Button Response Report.csv'
			);
		}
	}
}
