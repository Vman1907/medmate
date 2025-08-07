import api from '@/lib/api';
import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import RequestError from '@/lib/RequestError';
import { AdPageSetup, AdType } from '@/schema/ad-page-details';
import { AdList, Insights, MetaAudienceGroup } from '@/types/ad';
import UploadService from './upload.service';

export type AdPageDetails = AdPageSetup & {
	ad_accounts: { id: string; name: string }[];
	pages: { id: string; name: string }[];
	page_icon: string;
};

export type AdDetails = {
	ad_id: string;
	ad_name: string;
	status: string;
	effective_status: string;
	post_url: string;
	ad_type: string;
	ad_picture: string;
	ad_video_url: string;
	start_time: string;
	end_time: string;
	ad_message: string;
	ad_description: string;
	ad_website_link: string;
	autofill_message: string;
	whatsapp_greeting_message: string;
	targeting: {
		geo_locations?: {
			cities?: {
				name: string;
			}[];
			countries?: string[];
			regions?: {
				name: string;
			}[];
		};
		age_max: number;
		age_min: number;
		genders: number[];
		others: {
			life_events: { id: number; name: string }[];
			industries: { id: number; name: string }[];
			income: { id: number; name: string }[];
			family_statuses: { id: number; name: string }[];
		};
	};
	daily_budget: number;
	bid_amount: number;
};

export class AdCampaignService {
	static async getPageDetails() {
		try {
			const data = await apiClient.get<AdPageDetails>('/pages', {
				tags: [REVALIDATE_TAGS.PAGE],
			});
			return data;
		} catch (error) {
			return {
				page_icon: '',
				ad_account_id: '',
				is_registered: false,
				is_number_verified: false,
				page_id: '',
				whatsapp_number: '',
				ad_accounts: [],
				pages: [],
			} as AdPageDetails;
		}
	}

	static async disconnectPage() {
		await apiClient.delete('/pages');
		apiClient.revalidateTag(REVALIDATE_TAGS.PAGE);
	}

	static async generateAuthToken(code: string) {
		await apiClient.post('/pages', { code });
		await apiClient.revalidateTag(REVALIDATE_TAGS.PAGE);
	}

	static async updatePageDetails(
		details: Partial<{
			page_id: string;
			ad_account_id: string;
		}>
	) {
		await apiClient.patch('/pages', {
			page_id: details.page_id,
			ad_account_id: details.ad_account_id,
		});
		await apiClient.revalidateTag(REVALIDATE_TAGS.PAGE);
	}

	static async updateNumber(number: string) {
		try {
			const data = await apiClient.post<any>('/pages/update-number', {
				whatsapp_number: number,
			});
			if (data.verification_code_sent) {
				return {
					verification_code_sent: true,
					is_number_verified: false,
				};
			} else {
				return {
					verification_code_sent: false,
					...(data as AdPageSetup),
				};
			}
		} catch (error) {
			return {
				verification_code_sent: false,
				is_number_verified: false,
			};
		}
	}

	static async verifyNumber(code: string) {
		const { data } = await apiClient.post<any>('/pages/verify-number', { code });
		apiClient.revalidateTag(REVALIDATE_TAGS.PAGE);
		return data as AdPageSetup;
	}

	static async getGeoLocation(query: string) {
		try {
			const data = await apiClient.get<{ geo_locations: any[] }>(
				`/pages/ads/targeting/geo_locations?q=${query}`
			);
			return data.geo_locations.map((location: any) => ({
				key: location.key ?? '',
				name: location.name ?? '',
				type: location.type ?? '',
				country_code: location.country_code ?? '',
				country_name: location.country_name ?? '',
			}));
		} catch (error) {
			return [];
		}
	}

	static async searchAdvancedTargeting(query: string) {
		try {
			const data = await apiClient.get<{
				demographics: any[];
				interests: any[];
				behaviors: any[];
			}>(`/pages/ads/targeting/advanced?q=${query}`);
			return {
				demographics: data.demographics.map((item: any) => ({
					id: item.id ?? 0,
					name: item.name ?? '',
					type: item.type ?? 'demographics',
					min_audience: item.min_audience ?? 0,
					max_audience: item.max_audience ?? 0,
				})),
				interests: data.interests.map((item: any) => ({
					id: item.id ?? 0,
					name: item.name ?? '',
					type: item.type ?? 'interests',
					min_audience: item.min_audience ?? 0,
					max_audience: item.max_audience ?? 0,
				})),
				behaviors: data.behaviors.map((item: any) => ({
					id: item.id ?? 0,
					name: item.name ?? '',
					type: item.type ?? 'behaviors',
					min_audience: item.min_audience ?? 0,
					max_audience: item.max_audience ?? 0,
				})),
			};
		} catch (error) {
			return {
				demographics: [],
				interests: [],
				behaviors: [],
			};
		}
	}

	static async uploadMedia(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		try {
			const { data } = await api.post('/pages/ads/creative', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return {
				name: data.name ?? '',
				url: data.url ?? '',
				id: data.id ?? '',
			};
		} catch (error) {
			throw new Error('Unable to upload media');
		}
	}

	static async createAd(details: AdType) {
		try {
			await apiClient.post('/pages/create-ad', details);
			apiClient.revalidateTag(REVALIDATE_TAGS.ADS);
			return {
				success: true,
				error: '',
			};
		} catch (error: any) {
			if (error instanceof RequestError) {
				return {
					success: false,
					error: error.getMessage(),
				};
			}
			return {
				success: false,
				error: 'Unable to create ad' as string,
			};
		}
	}

	static async getAds() {
		try {
			const data = await apiClient.get<{ results: AdList[] }>('/pages/ads', {
				tags: [REVALIDATE_TAGS.ADS],
			});
			return {
				success: true,
				ads: (data.results ?? []) as AdList[],
				error: '',
			};
		} catch (error: any) {
			return {
				success: false,
				ads: [],
				error: error instanceof RequestError ? error.getMessage() : 'Unable to fetch ads',
			};
		}
	}

	static async getInsights() {
		try {
			const data: any = await apiClient.get(`/pages/ads/insights`, {
				tags: [REVALIDATE_TAGS.ADS],
			});
			if (data?.report?.message === 'No insights found') {
				return {
					success: false,
					insights: null,
					error: 'No insights found',
				};
			}
			return {
				success: true,
				insights: data.report as Insights,
				error: '',
			};
		} catch (error) {
			return {
				success: false,
				insights: null,
				error: error instanceof RequestError ? error.getMessage() : 'Unable to fetch insights',
			};
		}
	}

	static async getAdInsights(ad_id: string): Promise<{
		success: boolean;
		details: AdDetails | null;
		insights: Insights | { message: 'No insights found' } | null;
		error: string;
	}> {
		try {
			const { details, insights } = await apiClient.get<{
				details: AdDetails;
				insights: Insights | { message: 'No insights found' } | null;
			}>(`/pages/ads/${ad_id}`, {
				tags: [REVALIDATE_TAGS.ADS + `:${ad_id}`],
			});

			return {
				success: true,
				details,
				insights,
				error: '',
			};
		} catch (error) {
			return {
				success: false,
				details: null,
				insights: null,
				error: error instanceof RequestError ? error.getMessage() : 'Unable to fetch insights',
			};
		}
	}

	static async updateAdStatus(ad_id: string, status: 'ACTIVE' | 'PAUSED') {
		try {
			await apiClient.patch(`/pages/ads/${ad_id}/status`, { status });
			apiClient.revalidateTag(REVALIDATE_TAGS.ADS + `:${ad_id}`);
			return {
				success: true,
				error: '',
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof RequestError ? error.getMessage() : 'Unable to update ad status',
			};
		}
	}

	static async exportAdConversations(ad_id: string) {
		await UploadService.downloadFile(`/pages/ads/${ad_id}/export`, `${ad_id}-conversations.csv`);
	}

	static async createNewCustomAudienceList(file: File, name: string, description: string) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('description', description);
		formData.append('name', name);
		try {
			await api.post('/pages/custom-audience', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			apiClient.revalidateTag(REVALIDATE_TAGS.ADS + `:custom-audience`);
			return {
				success: true,
				error: '',
			};
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof RequestError
						? error.getMessage()
						: 'Unable to create custom audience list',
			};
		}
	}

	static async getCustomerAudienceList() {
		try {
			const { results } = await apiClient.get<{ results: MetaAudienceGroup[] }>(
				'/pages/custom-audience',
				{
					tags: [REVALIDATE_TAGS.ADS + `:custom-audience`],
				}
			);
			return {
				success: true,
				list: results as MetaAudienceGroup[],
				error: '',
			};
		} catch (error) {
			return {
				success: false,
				list: [],
				error:
					error instanceof RequestError
						? error.getMessage()
						: 'Unable to fetch custom audience lists',
			};
		}
	}

	static async downloadSampleAudienceCSV() {
		const headers = [
			'Email',
			'Phone',
			'First Name',
			'Last Name',
			'Gender',
			'Year of Birth',
			'Month of Birth',
			'Day of Birth',
			'Country',
			'Zip Code',
		];

		const rows = [headers, headers.map(() => '')];

		const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'sample-audience.csv');
		document.body.appendChild(link);
		link.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(link);
	}
}
