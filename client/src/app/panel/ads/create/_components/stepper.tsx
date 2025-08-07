import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Circle, CircleCheck } from 'lucide-react';

export default function Stepper({ index }: { index: number }) {
	return (
		<div className='flex items-center justify-center md:max-w-2xl w-full self-center gap-4 text-sm'>
			<div className={cn('flex flex-col items-center', index > 0 && 'text-primary')}>
				<div>{index > 0 ? <CircleCheck /> : <Circle />}</div>
				<div>Summary</div>
			</div>

			<Separator className={cn('rounded-xl p-[0.1rem] md:w-1/4 w-0', index > 0 && 'bg-primary')} />

			<div className={cn('flex flex-col items-center', index > 1 && 'text-primary')}>
				<div>{index > 1 ? <CircleCheck /> : <Circle />}</div>
				<div>Details</div>
			</div>

			<Separator className={cn('rounded-xl p-[0.1rem] md:w-1/4 w-0', index > 1 && 'bg-primary')} />

			<div className={cn('flex flex-col items-center', index > 2 && 'text-primary')}>
				<div>{index > 2 ? <CircleCheck /> : <Circle />}</div>
				<div>Audience</div>
			</div>

			<Separator className={cn('rounded-xl p-[0.1rem] md:w-1/4 w-0', index > 2 && 'bg-primary')} />

			<div className={cn('flex flex-col items-center', index > 3 && 'text-primary')}>
				<div>{index > 3 ? <CircleCheck /> : <Circle />}</div>
				<div>Budget</div>
			</div>
		</div>
	);
}
