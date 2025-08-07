'use client';

import Each from '@/components/containers/each';
import { Badge } from '@/components/ui/badge';
import { AdType } from '@/schema/ad-page-details';
import { UseFormReturn } from 'react-hook-form';

export default function OverviewPage({
	form,
	decreaseStep,
	step,
}: {
	form: UseFormReturn<AdType>;
	decreaseStep: () => void;
	step: number;
}) {
	const details = form.watch();
	return (
		<>
			<div>
				<div className='font-medium text-lg'>Overview</div>
				<div>Advertisement will take sometime to get approved from facebook </div>
				<div>You will be able to stop the advertisement, anytime on platform</div>
			</div>
			<div className='grid grid-cols-3 gap-4'>
				<div>Advertisement Name:</div>
				{details.ad_name ? (
					<div className='col-span-2 font-medium'>{details.ad_name}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Name is required</div>
				)}
				<div>Advertisement Message:</div>
				{details.ad_message ? (
					<div className='col-span-2 font-medium'>{details.ad_message}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Message is required</div>
				)}
				<div>Website Link:</div>
				{details.ad_website_link ? (
					<div className='col-span-2 font-medium'>{details.ad_website_link}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Link is required</div>
				)}
				<div>Media type:</div>
				<div className='col-span-2 font-medium'>{details.ad_type.toUpperCase()}</div>
				<div>Media:</div>
				{details.ad_picture ? (
					<div className='col-span-2 font-medium'>{details.ad_picture}</div>
				) : details.ad_video_id ? (
					<div className='col-span-2 font-medium'>{details.ad_video_id}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Media is required</div>
				)}
				<div>Advertisement Description:</div>
				{details.ad_description ? (
					<div className='col-span-2 font-medium'>{details.ad_description}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Description is required</div>
				)}
				<div>Autofill message:</div>
				{details.autofill_message ? (
					<div className='col-span-2 font-medium'>{details.autofill_message}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>
						Autofill message is required
					</div>
				)}
				<div>Whatsapp greeting message:</div>
				{details.whatsapp_greeting_message ? (
					<div className='col-span-2 font-medium'>{details.whatsapp_greeting_message}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>
						Whatsapp greeting message is required
					</div>
				)}
				<div>Locations:</div>
				{details.targeting.geo_locations.length > 0 ? (
					<div className='col-span-2 font-medium'>
						{details.targeting.geo_locations.map((location) => location.name).join(', ')}
					</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Locations are required</div>
				)}
				<div>Genders:</div>
				{details.targeting.genders && details.targeting.genders.length > 0 ? (
					<div className='col-span-2 font-medium'>
						{details.targeting.genders[0] === 1
							? 'Male'
							: details.targeting.genders[0] === 2
							? 'Female'
							: 'Others'}
					</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Gender is required</div>
				)}
				<div>Age range:</div>
				<div className='col-span-2 font-medium'>
					{details.targeting.age_min} yrs - {details.targeting.age_max} yrs
				</div>
				<div>Audience:</div>
				{details.targeting.behaviors.length === 0 &&
				details.targeting.interests.length === 0 &&
				details.targeting.demographics.length === 0 ? (
					<div className='text-destructive col-span-2 font-medium'>Audience is required</div>
				) : (
					<div className='flex flex-wrap gap-4 col-span-2'>
						<Each
							items={details.targeting.demographics}
							render={(ele) => (
								<Badge className='bg-green-600 hover:bg-green-700 inline-flex items-center'>
									<div>{ele.name}</div>
								</Badge>
							)}
						/>
						<Each
							items={details.targeting.interests}
							render={(ele) => (
								<Badge className='bg-red-600 hover:bg-red-700 inline-flex items-center'>
									<div>{ele.name}</div>
								</Badge>
							)}
						/>
						<Each
							items={details.targeting.behaviors}
							render={(ele) => (
								<Badge className='bg-blue-600 hover:bg-blue-700 inline-flex items-center'>
									<div>{ele.name}</div>
								</Badge>
							)}
						/>
					</div>
				)}
				<div>Daily Budget:</div>
				{details.daily_budget > 0 ? (
					<div className='col-span-2 font-medium'>{details.daily_budget}</div>
				) : (
					<div className='text-destructive col-span-2 font-medium'>Daily budget is required</div>
				)}
				<div>Start Date:</div>
				<div className='col-span-2 font-medium'>{details.start_time.toDateString()}</div>
				<div>End Date:</div>
				<div className='col-span-2 font-medium'>{details.end_time.toDateString()}</div>
				<div>Total Budget:</div>
				<div className='col-span-2 font-medium'>
					₹{details.daily_budget * (details.end_time.getTime() - details.start_time.getTime())}
				</div>
			</div>
		</>
	);
}
