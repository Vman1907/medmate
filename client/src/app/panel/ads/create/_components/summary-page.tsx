import Show from '@/components/containers/show';
import Asterisk from '@/components/elements/Asterisk';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AdType } from '@/schema/ad-page-details';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { Info } from 'lucide-react';
import { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function SummaryPage({ form }: { form: UseFormReturn<AdType> }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
		if (!e.target.files) return;
		const file = e.target.files[0];
		if (!file) return;
		if (type === 'photo' && file.size > 30 * 1024 * 1024) {
			toast.error('Image cannot be greater than 30mb');
			return;
		}
		if (type === 'video' && file.size > 100 * 1024 * 1024) {
			toast.error('Video cannot be greater than 100mb');
			return;
		}
		setIsUploading(true);
		toast.promise(AdCampaignService.uploadMedia(file), {
			loading: 'Uploading media...',
			success: (res) => {
				if (type === 'photo') {
					form.setValue('ad_picture', res.url);
				} else {
					form.setValue('ad_video_id', res.id);
					form.setValue('ad_video_url', res.url);
				}
				return 'Media uploaded successfully';
			},
			error: 'Failed to upload media',
		});
		setIsUploading(false);
	};

	const ad_type = form.watch('ad_type');
	const ad_video_url = form.watch('ad_video_url');

	return (
		<>
			<div>
				<div className='font-medium text-lg'>Advertisement Details</div>
				<div>Provide details to create advertisement</div>
			</div>
			<div className='grid gap-4'>
				<FormField
					control={form.control}
					name='ad_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Advertisement Name
								<Asterisk />
								<span className='text-xs font-normal ml-2'>
									(this will not be shown to the customers)
								</span>
							</FormLabel>
							<FormControl>
								<Input {...field} type='text' placeholder='eg. Summer Sale 2025' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='ad_message'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Advertisement Caption
								<Asterisk />
							</FormLabel>
							<FormControl>
								<Textarea
									value={field.value}
									onChange={(e) => field.onChange(e.target.value)}
									placeholder='eg. Get 50% off on all products'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Label className='mt-2 inline-flex items-center gap-1'>
					Ad Media
					<Asterisk />
					<Tooltip>
						<TooltipTrigger type='button'>
							<Info className='w-4 h-4' />
						</TooltipTrigger>
						<TooltipContent side='right'>
							<p>No preview will be shown for video</p>
						</TooltipContent>
					</Tooltip>
				</Label>
				<div className='flex gap-4'>
					<FormField
						control={form.control}
						name='ad_type'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Select
										disabled={isUploading}
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
										defaultValue='photo'
									>
										<SelectTrigger className='px-4'>
											<SelectValue placeholder='Select media type' />
											<SelectContent>
												<SelectItem value='photo'>Image</SelectItem>
												<SelectItem value='video'>Video</SelectItem>
											</SelectContent>
										</SelectTrigger>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex items-start flex-1'>
						<Show.ShowIf condition={ad_type === 'photo'}>
							<>
								<FormField
									control={form.control}
									name='ad_picture'
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormControl>
												<Input placeholder='eg. https://example.com/image.jpg' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='px-4 py-2'>OR</div>
							</>
						</Show.ShowIf>
						<Show.ShowIf condition={!(ad_type === 'video' && !!ad_video_url)}>
							<FormItem className='w-fit'>
								<FormControl>
									<Input
										ref={fileInputRef}
										disabled={isUploading}
										onChange={(e) => handleFileChange(e, ad_type)}
										type='file'
										accept={
											ad_type === 'photo'
												? 'image/jpeg,image/png,image/jpg,image/webp'
												: 'video/mp4'
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						</Show.ShowIf>
						<Show.ShowIf condition={ad_type === 'video' && !!form.watch('ad_video_id')}>
							<div>
								<Button
									onClick={() => {
										form.setValue('ad_video_id', '');
										form.setValue('ad_video_url', '');
									}}
									variant={'link'}
								>
									Video added, reset Video?
								</Button>
							</div>
						</Show.ShowIf>
					</div>
				</div>
				<Show.ShowIf condition={ad_type === 'video'}>
					<div>
						<Label>
							Video Thumbnail
							<Asterisk />
						</Label>
						<div className='flex gap-4'>
							<FormField
								control={form.control}
								name='ad_picture'
								render={({ field }) => (
									<FormItem className='flex-1'>
										<FormControl>
											<Input placeholder='eg. https://example.com/image.jpg' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='px-4 py-2'>OR</div>
							<FormItem className='w-fit'>
								<FormControl>
									<Input
										ref={fileInputRef}
										disabled={isUploading}
										onChange={(e) => handleFileChange(e, 'photo')}
										type='file'
										accept={'image/jpeg,image/png,image/jpg,image/webp'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						</div>
					</div>
				</Show.ShowIf>
			</div>
		</>
	);
}
