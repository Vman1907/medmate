import Loading from '@/components/elements/loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Consultation • Medmate',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				{children}
			</main>
		</Suspense>
	);
}
