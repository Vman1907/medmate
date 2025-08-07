import BroadcastService from '@/services/broadcast.service';
import { notFound } from 'next/navigation';
import ResponseDataTable from './data-table';

export default async function ChatbotButtonReport({
	params,
	searchParams,
}: {
	params: {
		campaignId: string;
	};
	searchParams?: { [key: string]: string | undefined };
}) {
	if (!params || !params.campaignId) return notFound();

	const list = await BroadcastService.buttonResponseReport({
		campaignId: params.campaignId,
		exportCSV: false,
	});

	if (!list) return notFound();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<ResponseDataTable name={searchParams?.name ?? ''} id={params.campaignId} list={list ?? []} />
		</div>
	);
}
