'use client';

import { Recurring } from '@/schema/broadcastSchema';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createRecurring, editRecurring } from '../action';
import DataForm from './data-form';

export default function RecurringCampaign({ data, id }: { data?: Recurring; id?: string }) {
	const router = useRouter();
	function handleSave(data: Recurring) {
		if (id) {
			toast.promise(editRecurring(id, data), {
				loading: 'Updating Recurring Campaign',
				success: () => {
					router.replace(`/panel/campaigns/recurring`);
					return 'Recurring Campaign updated successfully';
				},
				error: 'Failed to update Recurring Campaign',
			});
		} else {
			toast.promise(createRecurring(data), {
				loading: 'Creating Recurring Campaign',
				success: () => {
					router.replace(`/panel/campaigns/recurring`);
					return 'Recurring Campaign created successfully';
				},
				error: 'Failed to create Recurring Campaign',
			});
		}
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Recurring Campaign</h2>
			</div>
			<DataForm onSubmit={handleSave} defaultValues={data} />
		</div>
	);
}
