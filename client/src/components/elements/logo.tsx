import { cn } from '@/lib/utils';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({
	weight: ['300'],
	subsets: ['latin'],
});

export default function Logo({ className }: { className?: string }) {
	return (
		<div className={cn('inline-flex items-center gap-2', className)}>
			<span
				className={cn(
					urbanist.className,
					'text-2xl font-light  text-black hover:text-black dark:text-white dark:hover:text-white'
				)}
			>
				M. |
			</span>
			<span
				className={cn(
					urbanist.className,
					'text-xl font-light text-black hover:text-black dark:text-white dark:hover:text-white'
				)}
			>
				Medmate
			</span>
		</div>
	);
}
