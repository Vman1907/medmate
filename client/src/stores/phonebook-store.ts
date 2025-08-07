import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { PhonebookRecordWithID } from '@/schema/phonebook';
import { create } from 'zustand';

interface PhonebookState {
	records: PhonebookRecordWithID[];
	totalRecords: number;
	isLoading: boolean;
	fetchPhonebook: (searchParams: {
		tags: string[];
		page: string;
		limit: string;
		[key: string]: string | string[];
	}) => Promise<void>;
}

export const usePhonebookStore = create<PhonebookState>((set) => ({
	records: [],
	totalRecords: 0,
	isLoading: false,

	fetchPhonebook: async (searchParams) => {
		set({ isLoading: true });

		try {
			const search = Object.keys(searchParams)
				.filter((key) => key.startsWith('search_'))
				.map((key) => `${key.replace('search_', '')}=${searchParams[key]}`);

			const urlParams = new URLSearchParams();
			urlParams.set('page', searchParams.page || '1');
			urlParams.set('limit', searchParams.limit || '20');
			urlParams.set('search', (search || []).join(','));
			urlParams.set('labels', (searchParams?.tags || []).join(','));

			const data = await apiClient.get<{
				records: PhonebookRecordWithID[];
				totalRecords: number;
			}>(`/phonebook?${urlParams.toString()}`, {
				tags: [
					REVALIDATE_TAGS.PHONEBOOK,
					REVALIDATE_TAGS.PHONEBOOK + `:query:${urlParams.toString()}`,
				],
			});

			set({
				records: data.records,
				totalRecords: data.totalRecords,
				isLoading: false,
			});
		} catch (error) {
			set({ isLoading: false });
		}
	},
}));
