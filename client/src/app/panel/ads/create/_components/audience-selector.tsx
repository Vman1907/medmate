'use client';

import Each from '@/components/containers/each';
import { Badge } from '@/components/ui/badge';
import { CommandDialog, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function AudienceSelector({
	isLoading,
	searchText,
	setSearchText,
	placeholder,
	open,
	setOpen,
	items,
	selectedItems,
	onChange,
}: {
	isLoading: boolean;
	searchText: string;
	setSearchText: (searchText: string) => void;
	placeholder: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	items: {
		interests: {
			id: string;
			name: string;
			type: string;
			min_audience: number;
			max_audience: number;
		}[];
		demographics: {
			id: string;
			name: string;
			type: string;
			min_audience: number;
			max_audience: number;
		}[];
		behaviors: {
			id: string;
			name: string;
			type: string;
			min_audience: number;
			max_audience: number;
		}[];
	};
	selectedItems: {
		interests: { id: string; name: string; type: string }[];
		demographics: { id: string; name: string; type: string }[];
		behaviors: { id: string; name: string; type: string }[];
	};
	onChange: ({
		behaviors,
		demographics,
		interests,
	}: {
		interests: { id: string; name: string; type: string }[];
		demographics: { id: string; name: string; type: string }[];
		behaviors: { id: string; name: string; type: string }[];
	}) => void;
}) {
	const handleSelect = (item: { id: string; name: string; type: string }) => {
		if (item.type === 'interests') {
			if (selectedItems.interests.find((selectedItem) => selectedItem.id === item.id)) {
				onChange({
					interests: selectedItems.interests.filter((selectedItem) => selectedItem.id !== item.id),
					demographics: selectedItems.demographics,
					behaviors: selectedItems.behaviors,
				});
			} else {
				onChange({
					interests: [...selectedItems.interests, item],
					demographics: selectedItems.demographics,
					behaviors: selectedItems.behaviors,
				});
			}
		} else if (item.type === 'behaviors') {
			if (selectedItems.behaviors.find((selectedItem) => selectedItem.id === item.id)) {
				onChange({
					interests: selectedItems.interests,
					demographics: selectedItems.demographics,
					behaviors: selectedItems.behaviors.filter((selectedItem) => selectedItem.id !== item.id),
				});
			} else {
				onChange({
					interests: selectedItems.interests,
					demographics: selectedItems.demographics,
					behaviors: [...selectedItems.behaviors, item],
				});
			}
		} else {
			if (selectedItems.demographics.find((selectedItem) => selectedItem.id === item.id)) {
				onChange({
					interests: selectedItems.interests,
					demographics: selectedItems.demographics.filter(
						(selectedItem) => selectedItem.id !== item.id
					),
					behaviors: selectedItems.behaviors,
				});
			} else {
				onChange({
					interests: selectedItems.interests,
					demographics: [...selectedItems.demographics, item],
					behaviors: selectedItems.behaviors,
				});
			}
		}
	};

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<Input
				className='w-full !border-none !outline-none active:!border-none !ring-0'
				placeholder={placeholder}
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<CommandList>
				<CommandEmpty>{isLoading ? 'Loading...' : 'No results found.'}</CommandEmpty>
				<Each
					items={items.interests ?? []}
					render={(item) => (
						<CommandItem key={item.id} value={item.id.toString()} className='!p-0'>
							<div
								onClick={() => handleSelect(item)}
								className={cn(
									'w-full p-4 flex items-center justify-between gap-2 cursor-pointer border-b-2',
									selectedItems.interests.find((selectedItem) => selectedItem.id === item.id)
										? 'text-primary'
										: ''
								)}
							>
								<div className='flex items-center'>
									{selectedItems.interests.find((selectedItem) => selectedItem.id === item.id) ? (
										<Check className='w-4 h-4' />
									) : (
										<></>
									)}
									{item.name}
								</div>
								{item.type ? (
									<Tooltip>
										<TooltipTrigger>
											<Badge variant='secondary' className='text-cyan-700'>
												{item.type.toUpperCase()}
											</Badge>
										</TooltipTrigger>
										<TooltipContent side='left' className='bg-white text-black z-[100]'>
											<p>Min range: {item.min_audience.toLocaleString('en-IN')}</p>
											<p>Max range: {item.max_audience.toLocaleString('en-IN')}</p>
										</TooltipContent>
									</Tooltip>
								) : (
									<></>
								)}
							</div>
						</CommandItem>
					)}
				/>
				<Each
					items={items.demographics ?? []}
					render={(item) => (
						<CommandItem key={item.id} value={item.id.toString()} className='!p-0'>
							<div
								onClick={() => handleSelect(item)}
								className={cn(
									'w-full p-4 flex items-center justify-between gap-2 cursor-pointer border-b-2',
									selectedItems.demographics.find((selectedItem) => selectedItem.id === item.id)
										? 'text-primary'
										: ''
								)}
							>
								<div className='flex items-center'>
									{selectedItems.demographics.find(
										(selectedItem) => selectedItem.id === item.id
									) ? (
										<Check className='w-4 h-4' />
									) : (
										<></>
									)}
									{item.name}
								</div>
								{item.type ? (
									<Tooltip>
										<TooltipTrigger>
											<Badge variant='secondary' className='text-blue-500'>
												{item.type.toUpperCase().split('_').join(' ')}
											</Badge>
										</TooltipTrigger>
										<TooltipContent side='left' className='bg-white text-black z-[100]'>
											<p>Min range: {item.min_audience.toLocaleString('en-IN')}</p>
											<p>Max range: {item.max_audience.toLocaleString('en-IN')}</p>
										</TooltipContent>
									</Tooltip>
								) : (
									<></>
								)}
							</div>
						</CommandItem>
					)}
				/>
				<Each
					items={items.behaviors ?? []}
					render={(item) => (
						<CommandItem key={item.id} value={item.id.toString()} className='!p-0'>
							<div
								onClick={() => handleSelect(item)}
								className={cn(
									'w-full p-4 flex items-center justify-between gap-2 cursor-pointer border-b-2',
									selectedItems.behaviors.find((selectedItem) => selectedItem.id === item.id)
										? 'text-primary'
										: ''
								)}
							>
								<div className='flex items-center'>
									{selectedItems.behaviors.find((selectedItem) => selectedItem.id === item.id) ? (
										<Check className='w-4 h-4' />
									) : (
										<></>
									)}
									{item.name}
								</div>
								{item.type ? (
									<Tooltip>
										<TooltipTrigger>
											<Badge variant='secondary' className='text-green-700'>
												{item.type.toUpperCase()}
											</Badge>
										</TooltipTrigger>
										<TooltipContent side='left' className='bg-white text-black z-[100]'>
											<p>Min range: {item.min_audience.toLocaleString('en-IN')}</p>
											<p>Max range: {item.max_audience.toLocaleString('en-IN')}</p>
										</TooltipContent>
									</Tooltip>
								) : (
									<></>
								)}
							</div>
						</CommandItem>
					)}
				/>
			</CommandList>
		</CommandDialog>
	);
}
