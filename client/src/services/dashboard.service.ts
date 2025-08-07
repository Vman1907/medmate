import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
type DashboardData = {
	conversations: { month: number; year: number; count: number }[];
	health: string;
	mediaSize: number;
	messages: { month: number; day: number; count: number }[];
	pendingToday: number;
	phoneRecords: number;
	contacts: number;
};
export class DashboardService {
	static async getDashboardData() {
		try {
			const data = await apiClient.get<DashboardData>(`/overview/dashboard`, {
				tags: [REVALIDATE_TAGS.DASHBOARD],
			});
			return {
				conversations: data.conversations.map((conversation: any) => {
					return {
						month: conversation.month ?? 0,
						year: conversation.year ?? 0,
						count: conversation.count ?? 0,
					};
				}),
				health: data.health ?? '',
				mediaSize: data.mediaSize ?? 0,
				messages:
					data.messages.map((message: any) => {
						return {
							month: message.month ?? 0,
							day: message.day ?? 0,
							count: message.count ?? 0,
						};
					}) ?? [],
				pendingToday: data.pendingToday ?? 0,
				phoneRecords: data.phoneRecords ?? 0,
				contacts: data.contacts ?? 0,
			} as DashboardData;
		} catch (error: any) {
			return null;
		}
	}
}
