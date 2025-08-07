import Asterisk from '@/components/elements/Asterisk';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AdType } from '@/schema/ad-page-details';
import { Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

export default function DetailsPage({
	form,
}: {
	form: UseFormReturn<AdType>;
	decreaseStep: () => void;
	increaseStep: () => void;
	step: number;
}) {
	return (
		<>
			<div>
				<div className='font-medium text-lg'>Advertisement Details</div>
				<div>Provide details to create advertisement</div>
			</div>
			<div className='grid gap-4'>
				<FormField
					control={form.control}
					name='ad_description'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Advertisement Description <Asterisk />
							</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder='eg. Get the best deals on our products!' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='ad_website_link'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Website Link
								<Asterisk />
							</FormLabel>
							<FormControl>
								<Input {...field} type='text' placeholder='eg. https://example.com'/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='autofill_message'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4 inline-flex items-center gap-1'>
								Autofill Message
								<Asterisk />
								<Tooltip>
									<TooltipTrigger type='button'>
										<Info className='w-4 h-4' />
									</TooltipTrigger>
									<TooltipContent side='top' className='bg-white border-2 text-black z-[100]'>
										<p>WhatsApp pre-filled message.</p>
									</TooltipContent>
								</Tooltip>
							</FormLabel>
							<FormControl>
								<Input {...field} type='text' placeholder='eg. I need more information'/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='whatsapp_greeting_message'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4 inline-flex items-center gap-1'>
								Whatsapp Greeting Message
								<Asterisk />
								<Tooltip>
									<TooltipTrigger type='button'>
										<Info className='w-4 h-4' />
									</TooltipTrigger>
									<TooltipContent side='top' className='bg-white border-2 text-black z-[100]'>
										<p>Default greeting message on Whatsapp chat window.</p>
									</TooltipContent>
								</Tooltip>
							</FormLabel>
							<FormControl>
								<Input {...field} type='text' placeholder='eg. Welcome user' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</>
	);
}
