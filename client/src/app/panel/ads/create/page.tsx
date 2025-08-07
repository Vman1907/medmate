'use client';

import { usePageDetails } from '@/components/context/pageDetails';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { AdSchema, AdType } from '@/schema/ad-page-details';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { MetaAudienceGroup } from '@/types/ad';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createAd } from '../actions';
import AdPreview from './_components/ad-preview';
import AudiencePage from './_components/audience-page';
import AboutPage from './_components/details-page';
import InvestmentPage from './_components/investment-page';
import Stepper from './_components/stepper';
import DetailsPage from './_components/summary-page';

const DEFAULT_VALUE: AdType = {
	ad_type: 'photo',
	daily_budget: 0,
	start_time: new Date(),
	end_time: new Date(new Date().setMonth(new Date().getMonth() + 1)),
	ad_name: '',
	ad_message: '',
	ad_description: '',
	ad_picture: '',
	ad_video_id: '',
	ad_video_url: '',
	ad_website_link: '',
	autofill_message: '',
	whatsapp_greeting_message: '',
	targeting: {
		geo_locations: [],
		custom_audiences: [],
		age_max: 65,
		age_min: 13,
		genders: [1, 2],
		behaviors: [],
		interests: [],
		demographics: [],
	},
};

export default function CreateAdPage() {
	const { page_icon, selected_page_name } = usePageDetails();
	const router = useRouter();
	const [step, setStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [custom_audiences, setCustomAudiences] = useState<{
		list: MetaAudienceGroup[];
		error: string;
	}>({ list: [], error: '' });
	const decreaseStep = () => {
		setStep((prev) => prev - 1);
	};
	const increaseStep = () => {
		if (step < 3) {
			setStep((prev) => prev + 1);
		}
	};
	const form = useForm<AdType>({
		resolver: zodResolver(AdSchema),
		defaultValues: DEFAULT_VALUE,
		mode: 'onChange',
	});

	const details = form.watch();

	const handleSubmit = async (details: AdType) => {
		setIsSubmitting(true);
		toast.promise(createAd(details), {
			loading: 'Creating ad...',
			success: () => {
				setIsSubmitting(false);
				// router.push('/panel/ads/ads-manager');
				return 'Ad created successfully';
			},
			error: (err: any) => {
				setIsSubmitting(false);
				return err.message;
			},
		});
	};

	useEffect(() => {
		AdCampaignService.getCustomerAudienceList()
			.then((res) => {
				if (res.success) {
					setCustomAudiences((prev) => ({ ...prev, list: res.list }));
				} else {
					setCustomAudiences((prev) => ({ ...prev, error: res.error }));
				}
			})
			.catch((err) => {
				setCustomAudiences((prev) => ({ ...prev, error: 'Unable to fetch custom audiences' }));
			});
	}, []);

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='flex items-center'>
				<Button type='button' className='self-start' variant={'link'} onClick={() => router.back()}>
					<ChevronLeftIcon className='w-6 h-6' />
				</Button>
				<h2 className='text-xl'>Create Advertisement</h2>
			</div>
			<Stepper index={step} />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4'>
					<div className='flex justify-between md:p-8 py-4 w-full'>
						<Button
							type='button'
							className={cn('self-start', step === 0 && 'hidden')}
							variant={'outline'}
							onClick={decreaseStep}
						>
							Back
						</Button>
						{step !== 3 && (
							<Button type={'button'} className='ml-auto self-end' onClick={increaseStep}>
								Next
							</Button>
						)}
					</div>
					<div className='grid lg:grid-cols-3 grid-cols-1 gap-4 px-4 lg:px-8'>
						<div className='col-span-2'>
							{step === 0 && <DetailsPage form={form} />}
							{step === 1 && (
								<AboutPage
									form={form}
									decreaseStep={decreaseStep}
									step={step}
									increaseStep={increaseStep}
								/>
							)}
							{step === 2 && <AudiencePage form={form} custom_audience={custom_audiences} />}
							{step === 3 && (
								<InvestmentPage
									form={form}
									decreaseStep={decreaseStep}
									step={step}
									increaseStep={increaseStep}
								/>
							)}
						</div>
						<div className='col-span-1'>
							{step === 3 && (
								<Button
									disabled={!form.formState.isValid || isSubmitting}
									type={'submit'}
									className='mx-auto self-center mb-4 w-full'
								>
									{form.formState.isValid ? 'Submit' : 'Please fill all fields'}
								</Button>
							)}
							<AdPreview
								details={{ ...details, post_url: '' }}
								page_name={selected_page_name}
								icon={page_icon}
							/>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
