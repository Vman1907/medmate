'use client';

import Each from '@/components/containers/each';
import { SearchBar } from '@/components/elements/searchbar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { MetaAudienceGroup } from '@/types/ad';
import { useState } from 'react';

export default function AudienceList({ list }: { list: MetaAudienceGroup[] }) {
	const [searchText, setSearchText] = useState('');
	const records = list.filter(
		(record) =>
			record.name.toLowerCase().includes(searchText.toLowerCase()) ||
			record.description.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div className='w-full flex flex-col gap-4 items-end'>
			<div className='w-full md:w-1/3'>
				<SearchBar
					onChange={setSearchText}
					onSubmit={setSearchText}
					placeholders={['Search by name', 'Search by description']}
				/>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden w-full'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-1/3'>Name</TableHead>
							<TableHead className='p-2'>Group Status</TableHead>
							<TableHead className='p-2'>Delivery Status</TableHead>
							<TableHead className='p-2'>Targeted Bound</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Each items={records} render={(item) => <RenderRow item={item} />} />
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

const RenderRow = ({ item }: { item: MetaAudienceGroup }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<TableRow onClick={() => setOpen((prev) => !prev)} className='cursor-pointer'>
				<TableCell className='w-1/3 px-4'>{item.name}</TableCell>
				<TableCell>{item.operation_status}</TableCell>
				<TableCell>{item.delivery_status}</TableCell>
				<TableCell>
					{item.lower_bound} to {item.upper_bound} Users
				</TableCell>
			</TableRow>
			{open && (
				<TableRow>
					<TableCell colSpan={4} className='bg-gray-300'>
						<p className='px-6'>
							<span className='font-bold'>Description : </span>
							{item.description || 'No description'}
						</p>
					</TableCell>
				</TableRow>
			)}
		</>
	);
};
