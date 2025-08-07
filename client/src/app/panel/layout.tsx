import { UserDetailsProvider } from '@/components/context/user-details';
import Loading from '@/components/elements/loading';
import PrefetchRoutes from '@/components/elements/PrefetchRoutes';
import AuthService from '@/services/auth.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Dashboard • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [userDetails] = await Promise.all([AuthService.userDetails()]);

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<PrefetchRoutes />
				<UserDetailsProvider data={{ ...userDetails! }}>{children}</UserDetailsProvider>
			</main>
		</Suspense>
	);
}
