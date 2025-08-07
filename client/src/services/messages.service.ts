import { TemplateMessageWithoutForwardProps } from '@/app/panel/conversations/_components/molecules/message-input';
import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { Contact } from '@/schema/phonebook';
import { QuickReply, Recipient } from '@/types/recipient';
import UploadService from './upload.service';

type Media = {
	url: string;
	mime_type: string;
	size: number;
	is_meta_url: boolean;
};

export default class MessagesService {
	static async fetchAllConversation({
		label_filter = [],
		ui_tags = [],
		status = 'active',
		query = '',
		next_cursor_id = null,
		next_cursor_timestamp = null,
		signal,
	}: {
		label_filter?: string[];
		ui_tags?: string[];
		status?: string;
		query?: string;
		next_cursor_id?: string | null;
		next_cursor_timestamp?: string | null;
		signal?: AbortSignal;
	}): Promise<{
		recipients: Recipient[];
		next_cursor_id: string | null;
		next_cursor_timestamp: string | null;
	}> {
		try {
			const { conversations, next_cursor } = await apiClient.getWithoutCache<{
				conversations: Recipient[];
				next_cursor?: {
					id: string;
					timestamp: string;
				};
			}>(
				'/conversation?' +
					'labels=' +
					label_filter.join(',') +
					(ui_tags.length !== 0 ? '&ui_tags=' + ui_tags.join(',') : '') +
					(status ? '&status=' + status : '') +
					(query ? '&query=' + query : '') +
					(next_cursor_id
						? `&next_cursor_id=${next_cursor_id}&next_cursor_timestamp=${next_cursor_timestamp}`
						: ''),
				{
					signal,
				}
			);
			return {
				recipients: (conversations ?? []).map((conversation: Recipient) => {
					return {
						id: conversation.id ?? '',
						recipient: conversation.recipient ?? '',
						profile_name: conversation.profile_name ?? '',
						labels: conversation.labels ?? [],
						last_message_at: conversation.last_message_at ?? '',
						active: conversation.active ?? false,
						conversation_status:
							(conversation.conversation_status as
								| 'active'
								| 'inactive'
								| 'interacted_chatbot'
								| 'interacting_chatbot'
								| 'requesting_intervention'
								| 'intervened') ?? 'inactive',
						conversation_ui_tag: conversation.conversation_ui_tag ?? [],
						unreadCount: conversation.unreadCount ?? 0,
						assigned_to: conversation.assigned_to ?? '',
						message_labels: conversation.message_labels ?? [],
						timestamp: conversation.timestamp ? new Date(conversation.timestamp) : new Date(),
					};
				}),
				next_cursor_id: next_cursor?.id ?? null,
				next_cursor_timestamp: next_cursor?.timestamp ?? null,
			};
		} catch (err) {
			return {
				recipients: [],
				next_cursor_id: null,
				next_cursor_timestamp: null,
			};
		}
	}

	static async fetchConversationMessages(
		recipientId: string,
		pagination: {
			page: number;
			limit?: number;
			signal?: AbortSignal;
		}
	) {
		try {
			const { labels, messages, expiry } = await apiClient.getWithoutCache<{
				labels: string[];
				messages: any[];
				expiry: number | 'EXPIRED';
			}>(
				`/conversation/${recipientId}/messages?page=${pagination.page}&limit=${
					pagination.limit || 50
				}`
			);
			return {
				messageLabels: labels ?? [],
				messages: messages.map((message: any) => {
					return {
						_id: message._id ?? '',
						status: message.status ?? '',
						labels: message.labels ?? [],
						recipient: message.recipient ?? '',
						received_at: message.received_at ?? '',
						delivered_at: message.delivered_at ?? '',
						read_at: message.read_at ?? '',
						sent_at: message.sent_at ?? '',
						seen_at: message.seen_at ?? '',
						message_id: message.message_id ?? '',
						failed_at: message.failed_at ?? '',
						failed_reason: message.failed_reason ?? '',

						header_type: message.header_type as 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT',
						header_content_source: message.header_content_source as 'LINK' | 'ID' | 'TEXT',
						header_content: message.header_content as string,
						body: {
							body_type: message.body.body_type ?? 'UNKNOWN',
							text: message.body.text ?? '',
							media_id: message.body.media_id ?? '',
							caption: message.body.caption ?? '',
							contacts: (message.body.contacts ?? []).map((contact: any) => {
								return {
									addresses: (contact.addresses ?? []).map((address: any) => {
										return {
											type: address.type ?? '',
											street: address.street ?? '',
											city: address.city ?? '',
											state: address.state ?? '',
											zip: address.zip ?? '',
											country: address.country ?? '',
											country_code: address.country_code ?? '',
										};
									}),
									birthday: contact.birthday ?? '',
									emails: (contact.emails ?? []).map((email: any) => {
										return {
											email: email.email ?? '',
											type: email.type ?? '',
										};
									}),
									name: {
										formatted_name: contact.name?.formatted_name ?? '',
										first_name: contact.name?.first_name ?? '',
										last_name: contact.name?.last_name ?? '',
										middle_name: contact.name?.middle_name ?? '',
										suffix: contact.name?.suffix ?? '',
										prefix: contact.name?.prefix ?? '',
									},
									org: {
										company: contact.org?.company ?? '',
										department: contact.org?.department ?? '',
										title: contact.org?.title ?? '',
									},
									phones: (contact.phones ?? []).map((phone: any) => {
										return {
											phone: phone.phone ?? '',
											wa_id: phone.wa_id ?? '',
											type: phone.type ?? '',
										};
									}),
									urls: (contact.urls ?? []).map((url: any) => {
										return {
											url: url.url ?? '',
											type: url.type ?? '',
										};
									}),
								};
							}),
							location: {
								latitude: message.body?.location?.latitude ?? '',
								longitude: message.body?.location?.longitude ?? '',
								name: message.body?.location?.name ?? '',
								address: message.body?.location?.address ?? '',
							},
						},
						footer_content: message.footer_content ?? '',
						buttons: (message.buttons ?? []).map((button: any) => {
							return {
								button_type: button.button_type ?? 'URL',
								button_content: button.button_content ?? '',
							};
						}),
						context: {
							from: message.context?.from ?? '',
							id: message.context?.id ?? '',
						},
						sender: {
							id: message.sender?.id ?? '',
							name: message.sender?.name ?? '',
						},
					};
				}),
				expiry: expiry as number | 'EXPIRED',
			};
		} catch (err) {
			return {
				messageLabels: [],
				messages: [],
				expiry: 'EXPIRED' as number | 'EXPIRED',
			};
		}
	}
	static async getMediaHead(messageId: string, mediaId: string): Promise<Media> {
		try {
			const { media } = await apiClient.head<{ media: Media }>(
				`/conversation/${messageId}/media/${mediaId}`
			);
			return media;
		} catch (err) {
			return {
				url: '',
				mime_type: '',
				size: 0,
				is_meta_url: false,
			};
		}
	}

	static async getMedia(messageId: string, mediaId: string): Promise<Media> {
		try {
			const { media } = await apiClient.get<{ media: Media }>(
				`/conversation/${messageId}/media/${mediaId}`
			);
			return media;
		} catch (err) {
			return {
				url: '',
				mime_type: '',
				size: 0,
				is_meta_url: false,
			};
		}
	}

	static async sendConversationMessage(
		recipientId: string,
		message: {
			type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'contacts';
			text?: string;
			media_id?: string;
			location?: {
				latitude?: string;
				longitude?: string;
				name?: string;
				address?: string;
			};
			contacts?: Omit<Contact, 'id' | 'formatted_name'>[];
			context?: {
				message_id?: string;
			};
		}
	) {
		if (!message.context?.message_id) {
			delete message.context;
		}
		try {
			await apiClient.post(`/conversation/${recipientId}/send-message`, message);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async sendQuickTemplateMessage({
		recipientId,
		type = 'quickReply',
		...details
	}: {
		recipientId: string;
		type?: string;
		context?: { message_id: string };
	} & (
		| TemplateMessageWithoutForwardProps
		| {
				quickReply?: string;
		  }
	)) {
		if ('header' in details && details.header?.type === 'NONE') {
			delete details.header;
		}
		if ('carousel' in details) {
			delete details.header;
			delete details.buttons;
		}
		if (!details.context?.message_id) {
			delete details.context;
		}
		try {
			await apiClient.post(`/conversation/${recipientId}/send-quick-message`, {
				type,
				...details,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async setNote(recipientId: string, note: string) {
		await apiClient.post(`/conversation/${recipientId}/note`, { note });
		await apiClient.revalidateTag(REVALIDATE_TAGS.CONVERSATIONS + `:${recipientId}:note`);
	}

	static async getNote(recipientId: string) {
		const data: any = await apiClient.get(`/conversation/${recipientId}/note`, {
			tags: [REVALIDATE_TAGS.CONVERSATIONS + `:${recipientId}:note`],
		});
		return data.note ?? '';
	}

	static async ConversationLabels(phone_number: string, labels: string[]) {
		try {
			await apiClient.post(`/phonebook/set-labels/phone/${phone_number}`, {
				labels,
				numbers: [phone_number],
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async assignMessageLabels(messageId: string, labels: string[]) {
		await apiClient.post(`/conversation/message/${messageId}/assign-labels`, {
			labels,
		});
	}

	static async markRead(message_id: string) {
		try {
			await apiClient.post(`/mark-read/${message_id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async fetchQuickReplies() {
		try {
			const { quickReplies } = await apiClient.get<{ quickReplies: QuickReply[] }>(
				'/users/quick-replies',
				{
					tags: [REVALIDATE_TAGS.CONVERSATIONS + ':quick-replies'],
				}
			);
			return quickReplies;
		} catch (err) {
			return [];
		}
	}

	static async addQuickReply({
		body,
		buttons,
		sections,
		message,
		footer,
		header,
		type,
		button_text,
		flow_id,
	}: {
		header?: string;
		footer?: string;
		message?: string;
		type?: string;
		body?: string;
		buttons?: string[];
		sections?: {
			title: string;
			buttons: string[];
		}[];
		flow_id?: string;
		button_text?: string;
	}) {
		const data: any = await apiClient.post('/users/quick-replies', {
			type,
			body,
			buttons,
			sections,
			message,
			header,
			footer,
			button_text,
			flow_id,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.CONVERSATIONS + ':quick-replies');
		return {
			id: data.id as string,
			type: data.type as 'text' | 'list' | 'button' | 'flow' | 'location',
			data: data.data,
		};
	}

	static async editQuickReply({
		id,
		message,
		body,
		buttons,
		sections,
		type,
		button_text,
		flow_id,
		footer,
		header,
	}: {
		id: string;
		header?: string;
		footer?: string;
		message?: string;
		type?: string;
		body?: string;
		buttons?: string[];
		sections?: {
			title: string;
			buttons: string[];
		}[];
		button_text?: string;
		flow_id?: string;
	}) {
		const data: any = await apiClient.put(`/users/quick-replies/${id}`, {
			type,
			message,
			body,
			buttons,
			sections,
			button_text,
			flow_id,
			footer,
			header,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.CONVERSATIONS + ':quick-replies');
		return {
			id: data.id as string,
			type: data.type as 'text' | 'list' | 'button' | 'flow' | 'location',
			data: data.data,
		};
	}

	static async deleteQuickReply(id: string) {
		await apiClient.delete(`/users/quick-replies/${id}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CONVERSATIONS + ':quick-replies');
	}

	static async togglePin(id: string) {
		await apiClient.post(`/conversation/${id}/toggle-pin`).catch(() => {});
	}

	static async toggleArchive(id: string) {
		await apiClient.post(`/conversation/${id}/toggle-archived`).catch(() => {});
	}

	static async markConversationRead(id: string) {
		await apiClient.post(`/conversation/${id}/mark-read`).catch(() => {});
	}

	static async exportConversations(phonebook_ids: string[]) {
		await UploadService.downloadFile(
			'/conversation/export-from-phonebook',
			'Conversations.csv',
			'POST',
			{
				ids: phonebook_ids,
			}
		);
	}
}
