'use client';

import Each from '@/components/containers/each';
import { Badge } from '@/components/ui/badge';
import { CommandDialog, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function SearchSelector({
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
		key: string;
		name: string;
		type: string;
		country_code: string;
		country_name: string;
	}[];
	selectedItems: {
		key: string;
		name: string;
		type: string;
		country_code: string;
		country_name: string;
	}[];
	onChange: (
		items: {
			key: string;
			name: string;
			type: string;
			country_code: string;
			country_name: string;
		}[]
	) => void;
}) {
	const handleSelect = (item: {
		key: string;
		name: string;
		type: string;
		country_code: string;
		country_name: string;
	}) => {
		if (selectedItems.find((selectedItem) => selectedItem.key === item.key)) {
			onChange(selectedItems.filter((selectedItem) => selectedItem.key !== item.key));
		} else {
			onChange([...selectedItems, item]);
		}
	};
	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<div className='relative'>
				<Input
					className='w-full !border-none !outline-none active:!border-none !ring-0'
					placeholder={placeholder}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>
			<CommandList>
				<CommandEmpty>{isLoading ? 'Loading...' : 'No results found.'}</CommandEmpty>
				<Each
					items={items ?? []}
					render={(item) => (
						<CommandItem key={item.key} value={item.key} className='!p-0'>
							<div
								onClick={() => handleSelect(item)}
								className={cn(
									'w-full p-4 flex items-center justify-between gap-2 cursor-pointer border-b-2',
									selectedItems.find((selectedItem) => selectedItem.key === item.key)
										? 'text-primary'
										: ''
								)}
							>
								<div className='flex items-center'>
									{selectedItems.find((selectedItem) => selectedItem.key === item.key) ? (
										<Check className='w-4 h-4' />
									) : (
										<></>
									)}
									{item.name}, {item.country_name}
								</div>
								<Badge>{item.type.toUpperCase()}</Badge>
							</div>
						</CommandItem>
					)}
				/>
			</CommandList>
		</CommandDialog>
	);
}
