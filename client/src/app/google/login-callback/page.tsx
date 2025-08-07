import GoogleService from '@/services/google.service';
import { notFound, redirect } from 'next/navigation';

export default async function LoginCallbackPage({
	searchParams: { code, state },
}: {
	searchParams: { code: string; state: string };
}) {
	if (!code || !state) {
		return notFound();
	}

	const success = await GoogleService.googleCallback(code, state);

	if (!success) {
		notFound();
	}

	redirect('/panel/home/dashboard');
}
