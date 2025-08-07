'use client';

import Asterisk from '@/components/elements/Asterisk';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getFormattedDateTimestamp } from '@/lib/utils';
import { AdType } from '@/schema/ad-page-details';
import { differenceInDays } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';

export default function InvestmentPage({
	form,
	decreaseStep,
	increaseStep,
	step,
}: {
	form: UseFormReturn<AdType>;
	decreaseStep: () => void;
	increaseStep: () => void;
	step: number;
}) {
	const dailyBudget = form.watch('daily_budget');
	const startDate = form.watch('start_time');
	const endDate = form.watch('end_time');
	const dateRange = differenceInDays(endDate, startDate) + 1;
	return (
		<>
			<div>
				<div className='font-medium text-lg'>Budget</div>
			</div>
			<div className=' grid gap-4'>
				<FormField
					control={form.control}
					name='daily_budget'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Per day budget
								<Asterisk />
							</FormLabel>
							<FormControl>
								<div className='flex items-center gap-2'>
									<div>INR</div>
									<div className='flex-1'>
										<Input
											min={1}
											type='number'
											value={field.value}
											onChange={(e) => {
												field.onChange(Number(e.target.value));
											}}
										/>
									</div>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='grid grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='start_time'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='mb-0 mt-4'>
									Start date
									<Asterisk />
								</FormLabel>
								<FormControl>
									<Input
										type='datetime-local'
										value={getFormattedDateTimestamp(field.value)}
										onChange={(e) => {
											field.onChange(new Date(e.target.value));
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='end_time'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='mb-0 mt-4'>
									End date
									<Asterisk />
								</FormLabel>
								<FormControl>
									<Input
										type='datetime-local'
										value={getFormattedDateTimestamp(field.value)}
										onChange={(e) => {
											field.onChange(new Date(e.target.value));
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Separator />
				<div className='flex items-center gap-4'>
					<div>Total budget</div>
					<div className='border-b-2 flex-1 border-dashed' />
					<div>
						₹{dailyBudget} x {dateRange} days = ₹{(dailyBudget * dateRange).toLocaleString('en-IN')}
					</div>
				</div>
			</div>
		</>
	);
}
