'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

type RangeSliderProps = {
	values: number[];
	onValuesChange: (values: number[]) => void;
	rangeLabel: string;
} & SliderPrimitive.SliderProps;

const RangeSlider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	RangeSliderProps
>(({ className, values, onValuesChange, rangeLabel, ...props }, ref) => {
	return (
		<div className='w-full'>
			<SliderPrimitive.Root
				ref={ref}
				className={cn('relative flex w-full touch-none select-none items-center', className)}
				value={values}
				onValueChange={onValuesChange}
				{...props}
			>
				<SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
					<SliderPrimitive.Range className='absolute h-full bg-primary' />
				</SliderPrimitive.Track>
				{values.map((_, index) => (
					<SliderPrimitive.Thumb
						key={index}
						className='block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
					/>
				))}
			</SliderPrimitive.Root>
			<div className='mt-2 text-center text-sm text-muted-foreground'>
				{rangeLabel}: {values[0]} - {values[1]}
			</div>
		</div>
	);
});
RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
