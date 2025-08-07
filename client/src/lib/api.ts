import axios from 'axios';
import { SERVER_URL } from './consts';
import RequestError from './RequestError';
import { debugPrint, getFormattedDateTimestamp } from './utils';

const isServer = typeof window === 'undefined';

const api = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true, // This ensures cookies are sent with every request
});

// Request interceptor
api.interceptors.request.use(async (config) => {
	let userId = Math.random().toString(36).substring(2, 15);
	if (isServer) {
		// If it's a server-side request, we need to manually set the cookie header
		const { cookies } = await import('next/headers');
		const cookieStore = cookies();
		const cookiesString = cookieStore
			.getAll()
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join('; ');
		config.headers['Cookie'] = cookiesString;
		userId = cookieStore.get('user-id')?.value ?? userId;
	}
	debugPrint(
		`API - [${config.url}] - ${getFormattedDateTimestamp()} - ${userId} - CACHE : ${
			config.headers['Cache-Control']
		}`
	);
	return config;
});

api.interceptors.response.use(
	async (response) => response,
	async (error) => {
		if (error.response?.data) {
			return Promise.reject(RequestError.fromAxiosError(error));
		}

		return Promise.reject(error);
	}
);

export default api;
