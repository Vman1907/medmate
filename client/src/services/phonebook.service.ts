import api from '@/lib/api';
import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { PhonebookRecord } from '@/schema/phonebook';
import UploadService from './upload.service';

export default class PhoneBookService {
	static async allLabels() {
		try {
			const data = await apiClient.get<{
				labels: string[];
				fields: { label: string; value: string }[];
			}>(`/phonebook/all-labels`, {
				tags: [REVALIDATE_TAGS.PHONEBOOK + ':all-labels'],
			});
			return {
				labels: data.labels,
				fields: data.fields,
			};
		} catch (err) {
			return {
				labels: [],
				fields: [],
			};
		}
	}
	static async export(labels: string[]) {
		const urlParams = new URLSearchParams();
		labels.forEach((label) => {
			urlParams.append('labels', label);
		});
		await UploadService.downloadFile(`/phonebook/export?${urlParams.toString()}`, 'phonebook.csv');
	}

	static async getRecord(id: string) {
		try {
			const data = await apiClient.get<{
				record: PhonebookRecord;
			}>(`/phonebook/${id}`, {
				tags: [
					REVALIDATE_TAGS.PHONEBOOK + `:${id}`,
					REVALIDATE_TAGS.PHONEBOOK + ':labels',
					REVALIDATE_TAGS.PHONEBOOK + ':records',
				],
			});
			return data.record;
		} catch (err) {
			return null;
		}
	}

	static async addRecord(
		record: Record<string, string | string[] | Record<string, string | undefined>>
	) {
		await apiClient.post(`/phonebook`, {
			records: [record],
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':all-labels');
	}

	static async updateRecord(
		id: string,
		record: Record<string, string | string[] | Record<string, string | undefined>>
	) {
		await apiClient.put(`/phonebook/${id}`, record);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + `:${id}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':all-labels');
	}

	static async deleteRecords(ids: string[]) {
		await apiClient.post(`/phonebook/delete-multiple`, {
			ids,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':records');
	}

	static async assignLabels({
		ids,
		numbers,
		labels,
		type = 'replace',
	}: {
		ids?: string[];
		numbers?: string[];
		labels: string[];
		type?: 'replace' | 'remove' | 'append';
	}) {
		await apiClient.post(`/phonebook/set-labels`, {
			ids,
			numbers,
			labels,
			type,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':labels');
	}

	static async bulkUpload(
		file: File,
		labels: string[] = [],
		type: 'replace' | 'remove' | 'append' = 'replace'
	) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('labels', labels.join(','));
		formData.append('type', type);

		await api.post(`/phonebook/bulk-upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK);
		apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':labels');
	}

	static async addFields(data: { name: string; defaultValue: string }) {
		await apiClient.post(`/phonebook/add-fields`, data);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK);
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':labels');
		await apiClient.revalidateTag(REVALIDATE_TAGS.PHONEBOOK + ':all-labels');
	}

	static async getAllIds() {
		try {
			const data = await apiClient.get<{
				selected: { [key: string]: boolean };
			}>(`/phonebook/all-ids`);
			return data.selected;
		} catch (err) {
			return {};
		}
	}
}
