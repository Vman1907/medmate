import MessageLinkService from '@/services/message-link.service';
import DataTable from './_components/data-table';

export default async function Message_Link() {
	const { data: records, error } = await MessageLinkService.getMessageLinks();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Message Links</h2>
			</div>
			<DataTable records={records} error={error} />
		</div>
	);
}
