import { PageDetailsProvider } from '@/components/context/pageDetails';
import Loading from '@/components/elements/loading';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { Suspense } from 'react';

export const metadata = {
	title: 'Create Ad • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const page_details = await AdCampaignService.getPageDetails();

	return (
		<Suspense fallback={<Loading />}>
			<PageDetailsProvider data={page_details}>{children}</PageDetailsProvider>
		</Suspense>
	);
}
