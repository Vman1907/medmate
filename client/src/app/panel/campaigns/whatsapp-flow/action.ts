'use server';

import { TWhatsappFlow } from '@/schema/whatsapp-flow';
import WhatsappFlowService from '@/services/whatsapp-flow.service';
import { RedirectType, redirect } from 'next/navigation';

export async function createWhatsappFlow(details: {
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
	const id = await WhatsappFlowService.createWhatsappFlow(details);
	redirect(`panel/campaigns/whatsapp-flow/${id}`, RedirectType.push);
}

export async function updateWhatsappFlow(
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
	await WhatsappFlowService.updateWhatsappFlow(flowId, details);
}

export async function publishWhatsappFlow(id: string) {
	await WhatsappFlowService.publishWhatsappFlow(id);
}

export async function saveWhatsappFlowContents(id: string, data: TWhatsappFlow) {
	await WhatsappFlowService.saveWhatsappFlowContents(id, data);
}

export async function deleteWhatsappFlow(id: string) {
	await WhatsappFlowService.deleteWhatsappFlow(id);
}
