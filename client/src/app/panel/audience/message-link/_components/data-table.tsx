'use client';

import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { getFormattedDate, isDateBetween } from '@/lib/utils';
import { MessageLink } from '@/types/message-links';
import { CaretSortIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import {
	ColumnDef,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DownloadIcon,
	PlusIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import toast from 'react-hot-toast';
import {
	DeleteButton,
	DeleteSelectionButton,
	DownloadButton,
	ExportButton,
	ViewQrButton,
} from './buttons';
import { CreateLinkDialog, EditDialog, SelectRangePopover } from './dialogs';

const generateColumns = ({
	setCreatedAtRange,
	setUpdatedAtRange,
	selectRange,
}: {
	setCreatedAtRange: (range?: DateRange) => void;
	setUpdatedAtRange: (range?: DateRange) => void;
	selectRange: (start: number, end: number) => void;
}): ColumnDef<MessageLink>[] => [
	{
		accessorKey: 'prefilled_message',
		header: ({ column, table }) => {
			return (
				<div className='inline-flex'>
					<div className='flex items-center gap-2'>
						<SelectRangePopover selectRange={selectRange} />
						<Checkbox
							checked={
								table.getIsAllPageRowsSelected() ||
								(table.getIsSomePageRowsSelected() && 'indeterminate')
							}
							onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						/>
					</div>
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Message
						<CaretSortIcon className='ml-2 h-4 w-4' />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className='px-6'>
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label='Select row'
					className='mr-4'
				/>
				{row.getValue('prefilled_message')}
			</div>
		),
	},
	{
		accessorKey: 'deep_link_url',
		header: () => {
			return <div className='px-4'>Link</div>;
		},
		cell: ({ row }) => <div className='px-4'>{row.getValue('deep_link_url')}</div>,
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<div
					className='px-4 inline-flex items-center' // variant='ghost'
				>
					Created At
					<DatePickerWithRange onDateChange={setCreatedAtRange}>
						<CalendarIcon className='ml-2 h-4 w-4 cursor-pointer' />
					</DatePickerWithRange>
					<CaretSortIcon
						className='ml-2 h-4 w-4 cursor-pointer'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					/>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className='px-4'>
				{getFormattedDate(new Date(row.getValue('createdAt')))
					.split('-')
					.reverse()
					.join('/')}
			</div>
		),
	},
	{
		accessorKey: 'updatedAt',
		header: ({ column }) => {
			return (
				<div className='px-4 inline-flex items-center'>
					Updated At
					<DatePickerWithRange onDateChange={setUpdatedAtRange}>
						<CalendarIcon className='ml-2 h-4 w-4 cursor-pointer' />
					</DatePickerWithRange>
					<CaretSortIcon
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						className='ml-2 h-4 w-4'
					/>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className='px-4'>
				{getFormattedDate(new Date(row.getValue('updatedAt')))
					.split('-')
					.reverse()
					.join('/')}
			</div>
		),
	},
	{
		accessorKey: 'action',
		header: () => {
			return <div className='text-center w-fit'>Action</div>;
		},
		cell: ({ row }) => {
			return (
				<div className='px-4 text-center flex gap-2 justify-center'>
					<ViewQrButton src={row.original['qr_image_url']} />
					<EditDialog message={row.original.prefilled_message} id={row.original.id} />
					<DownloadButton ids={[row.id]} />
					<DeleteButton id={row.id} />
				</div>
			);
		},
	},
];

const DataTable = ({ records, error }: { records: MessageLink[]; error: string }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchText, setSearchText] = useState('');
	const [filteredRecords, setFilteredRecords] = useState(records);
	const filteredRecordsRef = useRef(records);
	const [rowSelection, setRowSelection] = useState({});

	const [updatedAtRange, setUpdatedAtRange] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	const [createdAtRange, setCreatedAtRange] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	const selectRange = useCallback((start: number, end: number) => {
		if (start <= 0 || end <= 0 || start > end || start === end) {
			toast.error('Invalid range. Please enter valid start and end range.');
			return;
		}
		const selectedRecords = filteredRecordsRef.current.slice(start - 1, end);
		setRowSelection(
			selectedRecords.reduce((acc, record) => {
				acc[record.id] = true;
				return acc;
			}, {} as Record<string, boolean>)
		);
	}, []);

	const columns = useMemo(() => {
		return generateColumns({
			setCreatedAtRange,
			setUpdatedAtRange,
			selectRange,
		});
	}, [selectRange]);

	useEffect(() => {
		const lowercasedSearch = searchText.toLowerCase();
		const filtered = records.filter((record) => {
			const filterByText =
				record.prefilled_message.toLowerCase().includes(lowercasedSearch) ||
				record.deep_link_url.toLowerCase().includes(lowercasedSearch) ||
				record.code.toLowerCase().includes(lowercasedSearch);

			let filterByCreatedAt = true;
			let filterByUpdatedAt = true;

			if (createdAtRange && createdAtRange.from && createdAtRange.to) {
				filterByCreatedAt = isDateBetween(
					new Date(record.createdAt),
					createdAtRange.from,
					createdAtRange.to
				);
			}

			if (updatedAtRange && updatedAtRange.from && updatedAtRange.to) {
				filterByUpdatedAt = isDateBetween(
					new Date(record.updatedAt),
					updatedAtRange.from,
					updatedAtRange.to
				);
			}

			return filterByText && filterByCreatedAt && filterByUpdatedAt;
		});
		setFilteredRecords(filtered);
		filteredRecordsRef.current = filtered;
		setPage(1);
	}, [createdAtRange, records, searchText, updatedAtRange]);

	const ids = useMemo(() => {
		return filteredRecords
			.filter((record) => Object.keys(rowSelection).includes(record.id))
			.map((record) => record.id);
	}, [filteredRecords, rowSelection]);

	const displayedRecords = useMemo(() => {
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		return filteredRecords.slice(startIndex, endIndex);
	}, [filteredRecords, page, limit]);

	const maxPage = useMemo(
		() => Math.ceil(filteredRecords.length / limit),
		[filteredRecords, limit]
	);

	const table = useReactTable({
		data: displayedRecords,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id,
		state: {
			sorting,
			rowSelection,
			columnVisibility,
		},
	});

	const handlePageChange = (newPage: number) => setPage(newPage);

	return (
		<div className='w-full'>
			<div className='flex flex-wrap items-center justify-between px-2 mt-3 gap-4'>
				<div className='flex items-center space-x-3'>
					<div className='flex items-center space-x-3'>
						<div className='flex items-center space-x-2'>
							<p className='text-sm font-medium'>Rows</p>
							<Select
								value={String(limit)}
								onValueChange={(value) => {
									setLimit(Number(value));
									setPage(1);
								}}
							>
								<SelectTrigger className='h-8 w-[90px] text-black dark:text-white'>
									<SelectValue placeholder={String(limit)} />
								</SelectTrigger>
								<SelectContent>
									{[10, 50, 100, 500, 1000].map((pageSize) => (
										<SelectItem key={pageSize} value={String(pageSize)}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='flex justify-start items-center space-x-2 '>
						<p className='text-sm font-medium'>
							Page {maxPage === 0 ? 1 : page} of {maxPage === 0 ? 1 : maxPage}
						</p>
						<Button variant='outline' disabled={page <= 1} onClick={() => handlePageChange(1)}>
							<DoubleArrowLeftIcon className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							disabled={page === 1}
							onClick={() => handlePageChange(page - 1)}
						>
							<ChevronLeftIcon className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							disabled={page >= maxPage}
							onClick={() => handlePageChange(page + 1)}
						>
							<ChevronRightIcon className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							disabled={page === maxPage}
							onClick={() => handlePageChange(maxPage)}
						>
							<DoubleArrowRightIcon className='h-4 w-4' />
						</Button>
					</div>
				</div>
				<div className='flex items-center space-x-3'>
					<Input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder='Search'
						className='h-8'
					/>

					<Show.ShowIf condition={Object.keys(rowSelection).length > 0}>
						<DeleteSelectionButton ids={Object.keys(rowSelection)} />
						<ExportButton ids={Object.keys(rowSelection)} />
						<DownloadButton ids={ids}>
							<DownloadIcon className='w-4 h-4 mr-1' />
							Download
						</DownloadButton>
					</Show.ShowIf>
					<div className='flex gap-x-2 gap-y-1 flex-wrap '>
						<CreateLinkDialog>
							<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
								<PlusIcon className='w-4 h-4 mr-1' />
								Create
							</Button>
						</CreateLinkDialog>
					</div>
				</div>
			</div>
			<div className='rounded-md border mt-3'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className='p-4'>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='text-center'>
									{error || 'No results.'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default DataTable;
