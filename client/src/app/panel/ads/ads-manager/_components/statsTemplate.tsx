import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export default function StatsTemplate({
	label,
	value,
	tooltip,
	color,
}: {
	color: string;
	label: string;
	value: string;
	tooltip?: string;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					className={cn(
						'h-[125px] aspect-video rounded-3xl shadow-lg drop-shadow-sm flex flex-col items-center justify-center whitespace-pre bg-gray-200',
						color
					)}
				>
					<h2 className='font-medium text-base whitespace-pre text-wrap inline-flex items-center gap-1'>
						{label}
						<Info className='w-4 h-4' />
					</h2>
					<h3 className='font-bold text-2xl'>{value}</h3>
				</div>
			</TooltipTrigger>
			<TooltipContent side='bottom' className='bg-white text-black z-[100]'>
				<p>{tooltip}</p>
			</TooltipContent>
		</Tooltip>
	);
}
