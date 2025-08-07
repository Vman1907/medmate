import { TemplateMessageWithoutForwardProps } from '@/app/panel/conversations/_components/molecules/message-input';
import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { RecurringWithId } from '@/schema/broadcastSchema';
import UploadService from './upload.service';

const validateRecurringResult = (recurring: any): RecurringWithId => {
	return {
		id: recurring.id ?? '',
		name: recurring.name ?? '',
		description: recurring.description ?? '',
		wish_from: recurring.wish_from ?? 'birthday',
		labels: recurring.labels ?? [],
		template_id: recurring.template_id ?? '',
		template_name: recurring.template_name ?? '',
		delay: recurring.delay ?? 0,
		startTime: recurring.startTime ?? '10:00',
		endTime: recurring.endTime ?? '18:00',
		active: recurring.status ?? 'ACTIVE',
		header: {
			type: recurring.template_header?.type ?? 'NONE',
			text: (recurring.template_header?.text ?? []).map((text: any) => ({
				custom_text: text.custom_text ?? '',
				variable_from: text.variable_from ?? 'custom_text',
				phonebook_data: text.phonebook_data ?? '',
				fallback_value: text.fallback_value ?? '',
			})),
			media_id: recurring.header?.media_id ?? '',
		},
		body:
			(recurring.template_body ?? []).map((text: any) => ({
				custom_text: text.custom_text ?? '',
				variable_from: text.variable_from ?? 'custom_text',
				phonebook_data: text.phonebook_data ?? '',
				fallback_value: text.fallback_value ?? '',
			})) ?? [],
		carousel: {
			cards: (recurring.template_carousel?.cards ?? []).map((card: any) => ({
				header: {
					media_id: card.header.media_id ?? '',
				},
				body: (card.body ?? []).map((text: any) => ({
					custom_text: text.custom_text ?? '',
					variable_from: text.variable_from ?? 'custom_text',
					phonebook_data: text.phonebook_data ?? '',
					fallback_value: text.fallback_value ?? '',
				})),
				buttons: card.buttons ?? [],
			})),
		},
		buttons: recurring.template_buttons ?? [],
	};
};

export default class RecurringService {
	static async getRecurringList(): Promise<RecurringWithId[]> {
		try {
			const { list } = await apiClient.get<{ list: RecurringWithId[] }>('/broadcast/recurring', {
				tags: [REVALIDATE_TAGS.RECURRING],
			});
			return list.map(validateRecurringResult);
		} catch (err) {
			return [];
		}
	}

	static async createRecurring(details: TemplateMessageWithoutForwardProps) {
		if (details.header?.type === 'NONE') {
			delete details.header;
		}
		if (details.buttons?.length === 0) {
			delete details.buttons;
		}
		if (details.carousel?.cards.length === 0) {
			delete details.carousel;
		}
		const data: any = await apiClient.post(`/broadcast/recurring`, {
			...details,
			template_header: details.header,
			template_body: details.body,
			template_buttons: details.buttons,
			template_carousel: details.carousel,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.RECURRING);

		return validateRecurringResult(data.details);
	}

	static async getRecurring(recurringId: string) {
		try {
			const data: any = await apiClient.get(`/broadcast/recurring/${recurringId}`, {
				tags: [REVALIDATE_TAGS.RECURRING + `:${recurringId}`],
			});
			return validateRecurringResult(data.details);
		} catch (err) {
			return null;
		}
	}

	static async editRecurring(
		details: {
			id: string;
			name: string;
			description: string;
			wish_from: 'birthday' | 'anniversary';
			labels: string[];
			delay: number;
			startTime: string;
			endTime: string;
		} & TemplateMessageWithoutForwardProps
	) {
		if (details.header?.type === 'NONE') {
			delete details.header;
		}
		const data: any = await apiClient.put(`/broadcast/recurring/${details.id}`, {
			...details,
			template_header: details.header,
			template_body: details.body,
			template_buttons: details.buttons,
			template_carousel: details.carousel,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.RECURRING);
		await apiClient.revalidateTag(REVALIDATE_TAGS.RECURRING + `:${details.id}`);
		return validateRecurringResult(data);
	}

	static async toggleRecurring(recurringId: string) {
		const data: any = await apiClient.post(`/broadcast/recurring/${recurringId}/toggle`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.RECURRING);
		return data;
	}

	static async deleteRecurring(recurringId: string) {
		await apiClient.delete(`/broadcast/recurring/${recurringId}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.RECURRING);
	}

	static async rescheduleRecurring(recurringId: string) {
		const data: any = await apiClient.post(`/broadcast/recurring/${recurringId}/reschedule`);
		return data;
	}

	static async downloadRecurring(recurringId: string) {
		await UploadService.downloadFile(`/broadcast/recurring/${recurringId}/export`, 'Recurring.csv');
	}
}
