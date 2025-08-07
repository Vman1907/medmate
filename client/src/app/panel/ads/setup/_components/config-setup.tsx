'use client';

import Each from '@/components/containers/each';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { updateDetails } from '../../actions';

export const ConfigAccountSetup = ({
	value,
	items,
}: {
	value: string;
	items: { id: string; name: string }[];
}) => {
	function updateId(ad_account_id: string) {
		toast.promise(updateDetails({ ad_account_id }), {
			loading: 'Updating account id...',
			success: 'Account id updated successfully',
			error: 'Failed to update page id',
		});
	}

	return (
		<Select value={value} onValueChange={updateId} disabled={!!value || items.length === 0}>
			<SelectTrigger>
				<SelectValue placeholder='Choose Account' />
			</SelectTrigger>
			<SelectContent>
				<Each items={items} render={(ele) => <SelectItem value={ele.id}>{ele.name}</SelectItem>} />
			</SelectContent>
		</Select>
	);
};

export const ConfigPageSetup = ({
	value,
	items,
}: {
	value: string;
	items: { id: string; name: string }[];
}) => {
	function updateId(page_id: string) {
		toast.promise(updateDetails({ page_id: page_id }), {
			loading: 'Updating page id...',
			success: 'Page id updated successfully',
			error: 'Failed to update page id',
		});
	}

	return (
		<Select value={value} onValueChange={updateId} disabled={!!value || items.length === 0}>
			<SelectTrigger>
				<SelectValue placeholder='Choose Page' />
			</SelectTrigger>
			<SelectContent>
				<Each items={items} render={(ele) => <SelectItem value={ele.id}>{ele.name}</SelectItem>} />
			</SelectContent>
		</Select>
	);
};
