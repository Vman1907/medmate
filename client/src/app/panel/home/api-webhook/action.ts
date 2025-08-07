'use server';

import APIWebhookService from '@/services/apiwebhook.service';

export async function createApiKey(name: string, device: string) {
	const token = await APIWebhookService.createApiKey(name, device);
	return token;
}

export async function deleteApiKey(id: string) {
	await APIWebhookService.deleteApiKey(id);
}

export async function validateWebhook(id: string) {
	await APIWebhookService.validateWebhook(id);
}

export async function createWebhook(name: string, device: string, url: string) {
	await APIWebhookService.createWebhook(name, device, url);
}

export async function deleteWebhook(id: string) {
	await APIWebhookService.deleteWebhook(id);
}
