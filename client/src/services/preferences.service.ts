import { apiClient } from '@/lib/apiClient';

export default class PreferencesService {
	static async setMediaDownloadLocation(
		location: 'off' | 'local' | 'google_drive:all' | 'google_drive:manual'
	) {
		await apiClient.patch('/preferences', {
			media_download: location,
		});
	}

	static async getPreferences() {
		const data = await apiClient.getWithoutCache<{
			media_download: 'off' | 'local' | 'google_drive:all' | 'google_drive:manual';
		}>('/preferences');
		return {
			media_download: data.media_download,
		};
	}
}
