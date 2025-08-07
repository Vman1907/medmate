'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
	TableCellLink,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { AdList } from '@/types/ad';
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
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const generateColumns = (): ColumnDef<AdList>[] => [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => <div className='px-4'>{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'start_time',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Start Time
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='px-4'>{new Date(row.getValue('start_time')).toLocaleDateString()}</div>
		),
	},
	{
		accessorKey: 'end_time',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					End Time
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='px-4'>{new Date(row.getValue('end_time')).toLocaleDateString()}</div>
		),
	},
	{
		accessorKey: 'bid_amount',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Budget
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='px-4 w-3/5'>INR {(row.getValue('bid_amount') as number) / 100}</div>
		),
	},
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Status
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='px-4'>
				{row.getValue('status') === 'ACTIVE' ? (
					<Badge>Active</Badge>
				) : (
					<Badge variant={'destructive'}>Paused</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: 'effective_status',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Delivery Status
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='px-4'>
				<Badge className='capitalize'>{row.getValue('effective_status')}</Badge>
			</div>
		),
	},
];

const DataTable = ({ records, error }: { records: AdList[]; error: string }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchText, setSearchText] = useState('');
	const [filteredRecords, setFilteredRecords] = useState(records);

	const columns = useMemo(() => generateColumns(), []);

	useEffect(() => {
		const lowercasedSearch = searchText.toLowerCase();
		const filtered = records.filter((record) => {
			return (
				record.name.toLowerCase().includes(lowercasedSearch) ||
				record.start_time.toLowerCase().includes(lowercasedSearch) ||
				record.end_time.toLowerCase().includes(lowercasedSearch) ||
				String(record.bid_amount).toLowerCase().includes(lowercasedSearch)
			);
		});
		setFilteredRecords(filtered);
		setPage(1);
	}, [records, searchText]);

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
		state: {
			sorting,
			columnVisibility,
		},
	});

	const handlePageChange = (newPage: number) => setPage(newPage);

	return (
		<div className='w-full'>
			<div className='flex flex-wrap items-center justify-end px-2 mt-3 gap-4'>
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

				<div className='flex justify-end items-center space-x-2 '>
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
				<div className='flex items-center space-x-3'>
					<Input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder='Search'
						className='h-8'
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline'>
								Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{table.getAllColumns().map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(value)}
									>
										{column.id === 'effective_status'
											? 'Delivery Status'
											: column.id.replace(/_/g, ' ')}
									</DropdownMenuCheckboxItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
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
										<TableCellLink
											href={`/panel/ads/ads-manager/${row.original.id}`}
											key={cell.id}
											className='p-4'
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCellLink>
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
