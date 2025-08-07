'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export function DatePickerWithRange({
	className,
	date,
	onDateChange,
	children,
}: {
	date?: DateRange;
	className?: React.HTMLAttributes<HTMLDivElement>;
	onDateChange: (date?: DateRange) => void;
	children?: React.ReactNode;
}) {
	const [internalState, setInternalState] = React.useState<DateRange | undefined>(date);

	const isControlled = date !== undefined;

	const value = isControlled ? date : internalState;

	const handleChange = (date?: DateRange) => {
		if (!isControlled) {
			setInternalState(date);
		}
		onDateChange(date);
	};

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>{children || <DefaultButton date={value} />}</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={value?.from}
						selected={value}
						onSelect={handleChange}
						numberOfMonths={2}
					/>
					<div className='flex items-center justify-between pb-2'>
						<Button
							variant={'ghost'}
							className='text-gray-400 hover:text-gray-700 text-center mx-auto'
							onClick={() => handleChange(undefined)}
						>
							Reset
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

const DefaultButton = ({ date }: { date?: DateRange }) => {
	return (
		<Button
			size={'sm'}
			id='date'
			variant={'outline'}
			className={cn(
				'w-[300px] justify-start text-left font-normal',
				!date && 'text-muted-foreground'
			)}
		>
			<CalendarIcon className='w-4 h-4 mr-2' />
			{date?.from ? (
				date.to ? (
					<>
						{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
					</>
				) : (
					format(date.from, 'LLL dd, y')
				)
			) : (
				<span>Pick a date</span>
			)}
		</Button>
	);
};
