import { Suspense } from 'react';
import { RecipientsListFallback } from './_components/atoms/fallback';
import DataProvider from './_components/contexts/data-provider';

export const metadata = {
	title: 'Conversations • Wautopilot',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
	return (
		<section className='h-full overflow-hidden'>
			<div className='flex w-full h-[calc(100vh-56px)] overflow-hidden'>
				<Suspense fallback={<RecipientsListFallback />}>
					<DataProvider>{children}</DataProvider>
				</Suspense>
			</div>
		</section>
	);
}
