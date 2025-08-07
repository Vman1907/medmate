import Loading from '@/components/elements/loading';
import { Suspense } from 'react';

export const metadata = {
	title: 'Message Links • Wautopilot',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<Loading />}>
			<section>{children}</section>
		</Suspense>
	);
}
