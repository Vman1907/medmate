'use server';

import RequestError from '@/lib/RequestError';
import MessageLinkService from '@/services/message-link.service';

export async function createMessageLink({ message, count }: { message: string; count: number }) {
	try {
		await MessageLinkService.createMessageLink({
			message,
			count,
		});
	} catch (error) {
		if (error instanceof RequestError) {
			throw new Error(error.getMessage());
		}
		throw new Error('Failed to create message link');
	}
}

export async function deleteMessageLink(id: string) {
	try {
		await MessageLinkService.deleteMessageLink(id);
	} catch (error) {
		if (error instanceof RequestError) {
			throw new Error(error.getMessage());
		}
		throw new Error('Failed to delete message link');
	}
}

export async function bulkDeleteMessageLink(ids: string[]) {
	try {
		await MessageLinkService.bulkDeleteMessageLink(ids);
	} catch (error) {
		if (error instanceof RequestError) {
			throw new Error(error.getMessage());
		}
		throw new Error('Failed to delete message links');
	}
}

export async function editLink(id: string, message: string) {
	try {
		await MessageLinkService.editLink(id, message);
	} catch (error) {
		if (error instanceof RequestError) {
			throw new Error(error.getMessage());
		}
		throw new Error('Failed to edit message link');
	}
}
