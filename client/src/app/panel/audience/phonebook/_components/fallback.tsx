import Each from '@/components/containers/each';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export function PhoneRecordFallback({
	columns,
	initialRows = 10,
}: {
	columns: number;
	initialRows?: number;
}) {
	return (
		<Each
			items={Array.from({ length: initialRows }, (_, i) => i)}
			render={(i) => (
				<TableRow>
					<Each
						items={Array.from({ length: columns }, (_, i) => i)}
						render={(i) => (
							<TableCell className='h-10'>
								<Skeleton className='h-full w-full' />
							</TableCell>
						)}
					/>
				</TableRow>
			)}
		/>
	);
}
