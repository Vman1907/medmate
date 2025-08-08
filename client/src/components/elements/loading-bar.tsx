'use client';

import { cn } from '@/lib/utils';

export default function LoadingBar({ height = 4 }: { height?: number }) {
	return (
		<div
			className={cn(
				'w-screen inline-flex justify-center items-center absolute left-0 top-0 right-0 bottom-0  z-[1]',
				`h-[${height}px]`
			)}
		>
			<div className={cn('w-full bg-primary animate-pulse loading-width', `h-[${height}px]`)} />
		</div>
	);
}
