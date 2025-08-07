import { apiClient } from '@/lib/apiClient';
import { signupSchema } from '@/schema/auth';
import { z } from 'zod';

type AuthResponse = {
	authenticated: boolean;
	isAdmin: boolean;
	isAgent: boolean;
	isMaster: boolean;
};

interface UserDetailsResponse {
	account: {
		name: string;
		email: string;
		phone: string;
	};
}

export default class AuthService {
	static async isAuthenticated() {
		try {
			await apiClient.getWithoutCache<AuthResponse>('/sessions/validate-auth');
			return {
				authenticated: true,
			};
		} catch (err) {
			return {
				authenticated: false,
			};
		}
	}

	static async login(email: string, password: string) {
		try {
			await apiClient.post<AuthResponse>('/sessions/login', {
				email,
				password,
			});
			return {
				authenticated: true,
			};
		} catch (err) {
			return {
				authenticated: false,
			};
		}
	}

	static async logout() {
		try {
			await apiClient.post(`/sessions/logout`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async register(details: z.infer<typeof signupSchema>) {
		try {
			await apiClient.post<AuthResponse>('/sessions/register', {
				name: `${details.firstName} ${details.lastName}`.trim(),
				phone: details.phone,
				email: details.email,
				password: details.password,
			});
			return {
				authenticated: true,
			};
		} catch (err) {
			return {
				authenticated: false,
			};
		}
	}

	static async forgotPassword(email: string, callbackURL: string) {
		try {
			await apiClient.post('/sessions/forgot-password', {
				email,
				callbackURL,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resetPassword(password: string, code: string) {
		try {
			await apiClient.post(`/sessions/reset-password/${code}`, {
				password,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async userDetails() {
		try {
			const data = await apiClient.getWithoutCache<UserDetailsResponse>('/sessions/details');
			return {
				name: data.account.name ?? '',
				email: data.account.email ?? '',
				phone: data.account.phone ?? '',
			} as {
				name: string;
				email: string;
				phone: string;
			};
		} catch (err) {
			return null;
		}
	}

	static async serviceAccount(id: string) {
		await apiClient.post(`/sessions/service-account/${id}`);
	}

	static async updateProfileDetails(details: { name: string; email: string; phone: string }) {
		await apiClient.post(`/sessions/details`, details);
	}
}
