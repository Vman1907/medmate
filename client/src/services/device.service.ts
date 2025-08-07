import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
type Device = {
	id: string;
	phoneNumberId: string;
	waid: string;
	phoneNumber: string;
	verifiedName: string;
};

type DeviceHealth = 'RED' | 'YELLOW' | 'GREEN';

type DeviceDetails = Device & {
	about: string;
	websites: string[];
	email: string;
	address: string;
	description: string;
	profile_picture_url: string;
	vertical: string;
};

export default class DeviceService {
	static async listDevices() {
		try {
			const data = await apiClient.get<{
				devices: Device[];
				currentDevice: string;
			}>(`/whatsapp-link/linked-devices`, {
				tags: [REVALIDATE_TAGS.DEVICES],
			});

			return {
				devices: data.devices as Device[],
				currentDevice: data.currentDevice as string,
			};
		} catch (err) {
			return {
				devices: [],
				currentDevice: '',
			};
		}
	}

	static async addDevice(details: {
		phoneNumberId: string;
		waid: string;
		accessToken?: string;
		code?: string;
	}) {
		try {
			await apiClient.post(`/whatsapp-link/link-device`, {
				phoneNumberId: details.phoneNumberId,
				waid: details.waid,
				accessToken: details.accessToken,
				code: details.code,
			});
			apiClient.revalidateTag('devices');

			return {
				success: true,
				message: 'Device added successfully',
			};
		} catch (err: any) {
			return {
				success: false,
				message:
					err?.response?.data?.message ??
					'Entry already exists or invalid details. Please check and try again.',
			};
		}
	}

	static async removeDevice(id: string) {
		await apiClient.delete(`/whatsapp-link/${id}`);
		apiClient.revalidateTag('devices');
	}

	static async fetchMessageHealth(id: string) {
		try {
			const data = await apiClient.get<{
				health: DeviceHealth;
			}>(`/whatsapp-link/${id}/message-health`);
			return data.health;
		} catch (err) {
			return 'RED';
		}
	}

	static async setCurrentDevice(id: string) {
		await apiClient.post(`/whatsapp-link/${id}/current-device`);
		apiClient.revalidateTag('devices');
	}

	static async updateDevice(
		id: string,
		data: {
			profile_picture_handle?: string;
			websites?: string[];
			email?: string;
			address?: string;
			vertical?: string;
			description?: string;
		}
	) {
		if (!data.email) {
			delete data.email;
		}
		await apiClient.patch(`/whatsapp-link/${id}`, data);
	}

	static async fetchDevice(id: string) {
		const data = await apiClient.get<DeviceDetails>(`/whatsapp-link/${id}`);
		return data;
	}
}
