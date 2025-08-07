'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Badge } from './badge';

export default function ComboboxMultiselectLabel({
	placeholder,
	items,
	value,
	disabled,
	onChange,
	buttonVariant = 'outline',
	children,
	searchText,
	setSearchText,
}: {
	placeholder: string;
	items: { key: string; country_name: string; type: string; country_code: string; name: string }[];
	value: { key: string; country_name: string; type: string; country_code: string; name: string }[];
	onChange: (
		value: { key: string; country_name: string; type: string; country_code: string; name: string }[]
	) => void;
	disabled?: boolean;
	buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	children?: React.ReactNode;
	searchText?: string;
	setSearchText?: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={buttonVariant}
					role='combobox'
					disabled={disabled}
					aria-expanded={open}
					className='w-full justify-between'
				>
					{placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0'>
				<Command>
					<Input
						value={searchText ?? ''}
						onChange={(e) => setSearchText?.(e.target.value)}
						placeholder='Search location'
					/>
					<CommandEmpty>No entries found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							{items.map((framework) => (
								<CommandItem
									key={framework.key}
									value={framework.key}
									onSelect={(ele) => {
										if (value.find((v) => v.key === ele)) {
											onChange(value.filter((v) => v.key !== ele));
										} else {
											onChange([...value, framework]);
										}
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4 ',
											value.find((v) => v.key === framework.key) ? 'text-primary' : 'text-gray-300'
										)}
									/>
									<div className='flex w-full justify-between'>
										<div>
											{framework.name.split('_').join(' ')}, {framework.country_name}
										</div>
										<Badge>{framework.type}</Badge>
									</div>
								</CommandItem>
							))}
							{children}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
