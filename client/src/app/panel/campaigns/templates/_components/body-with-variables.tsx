import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { FormControl, FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { countOccurrences } from '@/lib/utils';
import { Info } from 'lucide-react';

export default function BodyWithVariables({
	text,
	text_variables,
	label,
	limit,
	placeholder,
	headerTextChange,
	infoText,
}: {
	limit: string;
	label: string;
	text: string;
	text_variables: string[];
	placeholder: string;
	headerTextChange: (bodyText: string, example: string[]) => void;
	infoText?: string;
}) {
	const handleBodyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		headerTextChange(
			e.target.value,
			Array.from({ length: countOccurrences(e.target.value) }).map(
				(_, index) => text_variables[index] ?? ''
			)
		);
	};

	const handleExampleChange = (index: number, value: string) => {
		const newExample = [...text_variables];
		newExample[index] = value;
		headerTextChange(text, newExample);
	};

	return (
		<FormItem className='space-y-0 flex-1'>
			<FormLabel className='text-primary'>
				{label}
				<span className='ml-[0.2rem] text-red-800'>*</span>
			</FormLabel>
			<FormDescription className='text-xs pb-2'>
				{`Use dynamic variable like {{1}} {{2}} and so on`}. (Limit {text?.length ?? 0} / {limit})
			</FormDescription>
			<Show.ShowIf condition={!!infoText}>
				<FormDescription className='text-destructive text-xs pb-2 inline-flex gap-2'>
					<Info className='h-4 w-4' />
					{infoText}</FormDescription>
			</Show.ShowIf>
			<FormControl>
				<Textarea
					placeholder={placeholder}
					value={text ?? ''}
					className='h-[300px]'
					onChange={handleBodyTextChange}
				/>
			</FormControl>
			<Show.ShowIf condition={text_variables.length > 0}>
				<FormItem className='space-y-0 flex-1'>
					<FormLabel className='text-primary'>
						Example Values (Total:- {text_variables.length})
						<span className='ml-[0.2rem] text-red-800'>*</span>
					</FormLabel>
					<FormDescription className='text-xs'>
						({text_variables.filter((v) => v.trim().length > 0).length ?? 0} of{' '}
						{text_variables.length} provided)
					</FormDescription>
					<Each
						items={Array.from({ length: countOccurrences(text) })}
						render={(variable, index) => (
							<FormControl>
								<Input
									key={index}
									placeholder={`Example Value ${index + 1}`}
									isInvalid={text_variables[index].length === 0}
									value={text_variables[index] ?? ''}
									onChange={(e) => {
										handleExampleChange(index, e.target.value);
									}}
								/>
							</FormControl>
						)}
					/>
				</FormItem>
			</Show.ShowIf>
		</FormItem>
	);
}
