import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import RequestError from '@/lib/RequestError';
import { TWhatsappFlow } from '@/schema/whatsapp-flow';
import UploadService from './upload.service';

type TWhatsappFlowResponse = {
	id: string;
	name: string;
	status: 'DRAFT' | 'PUBLISHED';
	categories: (
		| 'SIGN_UP'
		| 'SIGN_IN'
		| 'APPOINTMENT_BOOKING'
		| 'LEAD_GENERATION'
		| 'CONTACT_US'
		| 'CUSTOMER_SUPPORT'
		| 'SURVEY'
		| 'OTHER'
	)[];
};
export default class WhatsappFlowService {
	static async exportWhatsappFlowData(id: string) {
		await UploadService.downloadFile(
			`/chatbot/whatsapp-flows/${id}/export`,
			'Whatsapp Flow Data.csv'
		);
	}

	static async createWhatsappFlow(details: {
		name: string;
		categories: (
			| 'SIGN_UP'
			| 'SIGN_IN'
			| 'APPOINTMENT_BOOKING'
			| 'LEAD_GENERATION'
			| 'CONTACT_US'
			| 'CUSTOMER_SUPPORT'
			| 'SURVEY'
			| 'OTHER'
		)[];
	}) {
		const data = await apiClient.post<{
			id: string;
		}>(`/chatbot/whatsapp-flows`, details);
		apiClient.revalidateTag(REVALIDATE_TAGS.WHATSAPP_FLOWS);
		return data.id;
	}

	static async updateWhatsappFlow(
		flowId: string,
		details: {
			name: string;
			categories: (
				| 'SIGN_UP'
				| 'SIGN_IN'
				| 'APPOINTMENT_BOOKING'
				| 'LEAD_GENERATION'
				| 'CONTACT_US'
				| 'CUSTOMER_SUPPORT'
				| 'SURVEY'
				| 'OTHER'
			)[];
		}
	) {
		await apiClient.patch(`/chatbot/whatsapp-flows/${flowId}`, details);
		apiClient.revalidateTag(REVALIDATE_TAGS.WHATSAPP_FLOWS);
	}

	static async listWhatsappFlows() {
		try {
			const data = await apiClient.get<{
				flows: TWhatsappFlowResponse[];
			}>(`/chatbot/whatsapp-flows`, {
				tags: [REVALIDATE_TAGS.WHATSAPP_FLOWS],
			});
			return data.flows;
		} catch (err) {
			if (err instanceof RequestError) {
				return err.getMessage();
			}
			return 'Unable to fetch WhatsApp Forms' as string;
		}
	}

	static async whatsappFlowContents(id: string) {
		try {
			const data = await apiClient.get<TWhatsappFlow>(`/chatbot/whatsapp-flows/${id}/assets`, {
				tags: [REVALIDATE_TAGS.WHATSAPP_FLOWS + `:${id}`],
			});
			return data.screens;
		} catch (err) {
			return null;
		}
	}

	static async saveWhatsappFlowContents(id: string, data: TWhatsappFlow) {
		await apiClient.post(`/chatbot/whatsapp-flows/${id}/assets`, data);
		apiClient.revalidateTag(REVALIDATE_TAGS.WHATSAPP_FLOWS + `:${id}`);
	}

	static async publishWhatsappFlow(flowId: string) {
		const data = await apiClient.post<{
			success: boolean;
		}>(`/chatbot/whatsapp-flows/${flowId}/publish`);
		if (data.success) {
			apiClient.revalidateTag(REVALIDATE_TAGS.WHATSAPP_FLOWS);
		}
		return data.success;
	}

	static async deleteWhatsappFlow(flowId: string) {
		const data = await apiClient.delete<{
			success: boolean;
		}>(`/chatbot/whatsapp-flows/${flowId}`);
		if (data.success) {
			apiClient.revalidateTag(REVALIDATE_TAGS.WHATSAPP_FLOWS);
		}
		return data.success;
	}
}
