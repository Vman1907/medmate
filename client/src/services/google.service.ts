import { apiClient } from '@/lib/apiClient';

type Quota = {
	limit: string;
	usage: string;
	usageInDrive: string;
	usageInDriveTrash: string;
};

const convertBytes = (bytes: string) => {
	const bytesNumber = Number(bytes);
	if (isNaN(bytesNumber)) {
		return '0 GB';
	}
	const MB = bytesNumber / 1048576;
	if (MB < 1024) {
		return `${MB.toFixed(2)} MB`;
	}
	return `${(bytesNumber / 1073741824).toFixed(2)} GB`;
};

export default class GoogleService {
	static async isConnected() {
		try {
			const { isConnected, email, quota } = await apiClient.getWithoutCache<{
				isConnected: boolean;
				email?: string;
				quota?: Quota;
				usage?: number;
			}>(`/google/is-connected`);
			return {
				isConnected,
				email: email ?? '',
				quota: {
					limit: convertBytes(quota?.limit ?? '0'),
					usage: convertBytes(quota?.usage ?? '0'),
					usageInDrive: convertBytes(quota?.usageInDrive ?? '0'),
					usageInDriveTrash: convertBytes(quota?.usageInDriveTrash ?? '0'),
					freeSpace: convertBytes(
						(Number(quota?.limit ?? '0') - Number(quota?.usage ?? '0')).toString()
					),
				},
			};
		} catch (err) {
			return {
				isConnected: false,
				email: '',
				quota: {
					limit: '0 GB',
					usage: '0 GB',
					usageInDrive: '0 GB',
					usageInDriveTrash: '0 GB',
					freeSpace: '0 GB',
				},
			};
		}
	}

	static async connectGoogle() {
		try {
			const { url } = await apiClient.post<{ url: string }>(`/google/login`);
			window.location.href = url;
		} catch (err) {}
	}

	static async googleCallback(code: string, state: string) {
		try {
			await apiClient.post(`/google/login-callback`, {
				code,
				state,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async disconnect() {
		await apiClient.post(`/google/logout`);
	}
}
