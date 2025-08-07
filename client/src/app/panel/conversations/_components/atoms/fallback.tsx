import Each from '@/components/containers/each';
import LoadingBar from '@/components/elements/loading-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function RecipientsListFallback() {
	return (
		<div
			className={cn(
				`flex flex-col md:border-r-2 overflow-hidden md:max-w-md md:min-w-[350px] bg-white p-2`,
				'!w-full'
			)}
		>
			<LoadingBar />
			<div className='pr-2 mb-2 mr-1 md:!px-0 flex gap-x-1'>
				<Skeleton className='h-10 w-10' />
				<Skeleton className='h-10 w-10' />
				<div className='flex-1'>
					<Skeleton className='h-10 w-full' />
				</div>
				<Skeleton className='h-10 w-10' />
			</div>
			<div className='flex flex-col overflow-y-scroll overflow-x-hidden h-[calc(100vh-160px)]'>
				<Each
					items={Array.from({ length: 6 }, (_, i) => i)}
					render={() => (
						<div className={cn('rounded-lg p-2 border-b', 'hover:bg-neutral-100')}>
							<div className='flex items-center flex-col group '>
								<div className='flex gap-2 relative w-full'>
									<div className='relative'>
										<Skeleton className='w-12 h-12 rounded-full' />
									</div>
									<div className='flex-1'>
										<div className='w-full'>
											<Skeleton className='w-full h-[20px]' />
										</div>
										<div className='mt-2 w-full inline-flex justify-between items-end'>
											<Skeleton className='w-[100px] h-[20px]' />
											<span className='text-xs'>
												<Skeleton className='w-[60px] h-[20px]' />
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className='flex justify-start w-full overflow-x-auto mt-2 gap-1'>
								<Skeleton className='w-[100px] h-[20px] rounded-md' />
								<Skeleton className='w-[100px] h-[20px] rounded-md' />
								<Skeleton className='w-[100px] h-[20px] rounded-md' />
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}

export function MessagesListFallback() {
	return (
		<Each
			items={Array.from({ length: 8 }, (_, i) => i % 2 === 0)}
			render={(isMe) => (
				<div
					className={cn('w-full flex flex-row rounded-xl', isMe ? 'justify-start' : 'justify-end')}
				>
					<div
						className={cn(
							'max-w-xs md:max-w-lg lg:max-w-2xl flex flex-col mb-4 ',
							isMe ? 'self-start' : 'self-end'
						)}
					>
						<div
							className={cn('flex mb-1 gap-1 items-end', isMe ? 'flex-row' : 'flex-row-reverse')}
						>
							<Skeleton
								className={cn(
									'w-[200px] md:w-[450px] h-[40px] group flex flex-col pl-4 pr-8 py-2 rounded-t-2xl relative',
									isMe
										? 'rounded-bl-none  rounded-br-2xl h-[80px]'
										: 'rounded-bl-2xl  rounded-br-none h-[40px]'
								)}
							/>
						</div>
					</div>
				</div>
			)}
		/>
	);
}
