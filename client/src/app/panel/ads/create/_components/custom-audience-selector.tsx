'use client';

import Each from '@/components/containers/each';
import { CommandDialog, CommandEmpty, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MetaAudienceGroup } from '@/types/ad';
import { Check } from 'lucide-react';

export default function CustomAudienceSelector({
	open,
	setOpen,
	searchText,
	setSearchText,
    placeholder,
	items,
	selectedItems,
	onChange,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	searchText: string;
	setSearchText: (searchText: string) => void;
    placeholder: string;
	items: MetaAudienceGroup[];
	selectedItems: string[];
	onChange: (items: string[]) => void;
}) {
	const handleSelect = (item: string) => {
		if (selectedItems.find((selectedItem) => selectedItem === item)) {
			onChange(selectedItems.filter((selectedItem) => selectedItem !== item));
		} else {
			onChange([...selectedItems, item]);
		}
	};

	const filteredList = items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<Input
				className='w-full !border-none !outline-none active:!border-none !ring-0'
				placeholder={placeholder}
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<CommandList>
				<CommandEmpty>{'No custom found.'}</CommandEmpty>
				<Each
					items={filteredList ?? []}
					render={(item) => (
						<CommandItem key={item.id} value={item.id.toString()} className='!p-0'>
							<div
								onClick={() => handleSelect(item.id)}
								className={cn(
									'w-full p-4 flex items-center justify-between gap-2 cursor-pointer border-b-2',
									selectedItems.find((selectedItem) => selectedItem === item.id)
										? 'text-primary'
										: ''
								)}
							>
								<div className='flex items-center'>
									{selectedItems.find((selectedItem) => selectedItem === item.id) ? (
										<Check className='w-4 h-4' />
									) : (
										<></>
									)}
									{item.name}
								</div>
							</div>
						</CommandItem>
					)}
				/>
			</CommandList>
		</CommandDialog>
	);
}
