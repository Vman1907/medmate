'use client';

import Show from '@/components/containers/show';
import LoadingBar from '@/components/elements/loading-bar';
import { usePhonebookStore } from '@/stores/phonebook-store';
import { useEffect } from 'react';
import { DataTable } from './_components/data-table';

export default function Phonebook({
	searchParams,
}: {
	searchParams: {
		tags: string[];
		page: string;
		limit: string;
		[key: string]: string | string[];
	};
}) {
	const { records, totalRecords, isLoading, fetchPhonebook } = usePhonebookStore();

	useEffect(() => {
		if (searchParams['add-phonebook']) {
			return;
		}
		fetchPhonebook(searchParams);
	}, [searchParams, fetchPhonebook]);

	return (
		<div className='relative'>
			<Show.ShowIf condition={isLoading}>
				<LoadingBar height={2} />
			</Show.ShowIf>
			<DataTable
				isLoading={isLoading}
				records={records}
				maxRecord={totalRecords}
				query={searchParams}
			/>
		</div>
	);
}
