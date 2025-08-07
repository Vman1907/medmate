import api from '@/lib/api';
import { apiClient } from '@/lib/apiClient';
import RequestError from '@/lib/RequestError';

export default class UploadService {
	static async generateMetaHandle(file: File) {
		const form = new FormData();
		form.append('file', file);
		const { data } = await api.post('/uploads/upload-meta-handle', form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return data.file as string;
	}
	static async generateMetaMediaId(file: File, onUploadProgress?: (progress: number) => void) {
		const form = new FormData();
		form.append('file', file);
		const { data } = await api.post(`/uploads/upload-meta-media`, form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				if (onUploadProgress) {
					onUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1)));
				}
			},
		});

		return data.media_id as string;
	}

	static async downloadFile(
		path: string,
		name?: string,
		method: 'GET' | 'POST' = 'GET',
		body?: object
	) {
		const response = await apiClient.rawRequest(path, {
			method,
			headers: {
				Accept: 'application/arraybuffer',
				'Content-Type': 'application/json',
			},
			...(body && method === 'POST' ? { body: JSON.stringify(body) } : {}),
		});

		if (!response.ok) {
			throw RequestError.fromResponse(response);
		}

		const blob = await response.blob();
		const contentDisposition = response.headers.get('content-disposition');
		const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
		const filename = name ?? (filenameMatch ? filenameMatch[1] : 'downloaded-file');

		// Create a temporary link element
		const downloadLink = document.createElement('a');
		downloadLink.href = window.URL.createObjectURL(blob);
		downloadLink.download = filename; // Specify the filename

		// Append the link to the body and trigger the download
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Clean up - remove the link
		document.body.removeChild(downloadLink);
	}
}
