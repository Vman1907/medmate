import { apiClient } from '@/lib/apiClient';
import { Admin } from '@/types/admin';

function processAdmin(admin: any): Admin {
	return {
		id: admin.id ?? '',
		email: admin.email ?? '',
		isSubscribed: admin.isSubscribed ?? false,
		phone: admin.phone ?? '',
		subscription_expiry: admin.subscription_expiry ?? '',
		name: admin.name ?? '',
		markup: admin.markup ?? 0,
		plan_name: admin.plan_name ?? '',
	};
}

export default class AdminsService {
	static async listAdmins(): Promise<Admin[]> {
		const { users } = await apiClient.get<{ users: Admin[] }>(`/users/admins`);
		return (users ?? []).map(processAdmin);
	}

	static async extendExpiry(id: string, date: string) {
		await apiClient.post(`/users/admins/${id}/extend-subscription`, { date });
		return true;
	}

	static async upgradePlan(id: string, data: { plan_id: string; date: string }) {
		await apiClient.post(`/users/admins/${id}/upgrade-plan`, { ...data });
	}
	static async setMarkUpPrice(id: string, rate: number) {
		await apiClient.post(`/users/admins/${id}/markup-price`, {
			rate,
		});
	}
	static async addBalance(id: string, amount: number) {
		await apiClient.post(`/users/admins/${id}/add-balance`, {
			amount,
		});
	}
}
