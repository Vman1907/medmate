'use client';

import Each from '@/components/containers/each';
import Asterisk from '@/components/elements/Asterisk';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { RangeSlider } from '@/components/ui/slider-range';
import { AdType } from '@/schema/ad-page-details';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { MetaAudienceGroup } from '@/types/ad';
import { Search, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import AudienceSelector from './audience-selector';
import CustomAudienceSelector from './custom-audience-selector';
import LocationSelector from './location-selector';

export default function AudiencePage({
	form,
	custom_audience,
}: {
	form: UseFormReturn<AdType>;
	custom_audience: {
		list: MetaAudienceGroup[];
		error: string;
	};
}) {
	const [geoLocation, setGeoLocation] = useState<
		{
			key: string;
			name: string;
			type: string;
			country_code: string;
			country_name: string;
		}[]
	>([]);

	const [interestsLists, setInterests] = useState<
		{
			id: string;
			name: string;
			type: string;
			min_audience: number;
			max_audience: number;
		}[]
	>([]);

	const [demographicsLists, setDemographics] = useState<
		{
			id: string;
			name: string;
			type: string;
			min_audience: number;
			max_audience: number;
		}[]
	>([]);

	const [behaviorsLists, setBehaviors] = useState<
		{
			id: string;
			name: string;
			type: string;
			min_audience: number;
			max_audience: number;
		}[]
	>([]);

	const [openLocationDialog, setOpenLocationDialog] = useState(false);
	const [openAudienceDialog, setOpenAudienceDialog] = useState(false);
	const [openCustomAudienceDialog, setOpenCustomAudienceDialog] = useState(false);
	const [searchLocationText, setSearchLocationText] = useState('');
	const [searchAudienceText, setSearchAudienceText] = useState('');
	const [searchCustomAudienceText, setSearchCustomAudienceText] = useState('');
	const [isGeoLocationLoading, setGeoLocationLoading] = useState(false);
	const [isAudienceLoading, setAudienceLoading] = useState(false);

	const fetchGeoLocations = async (keyword: string) => {
		setGeoLocationLoading(true);
		setGeoLocation([]);
		if (keyword.trim()) {
			const response = await AdCampaignService.getGeoLocation(keyword);
			setGeoLocation(response);
		} else {
			setGeoLocation([]);
		}
		setGeoLocationLoading(false);
	};

	const fetchAudience = async (keyword: string) => {
		setAudienceLoading(true);
		setInterests([]);
		setDemographics([]);
		setBehaviors([]);
		if (keyword.trim()) {
			const response = await AdCampaignService.searchAdvancedTargeting(keyword);
			setInterests(response.interests);
			setDemographics(response.demographics);
			setBehaviors(response.behaviors);
		} else {
			setInterests([]);
			setDemographics([]);
			setBehaviors([]);
		}
		setAudienceLoading(false);
	};

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (searchLocationText) {
				fetchGeoLocations(searchLocationText);
			}
		}, 1000);

		return () => clearTimeout(delayDebounceFn);
	}, [searchLocationText]);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (searchAudienceText) {
				fetchAudience(searchAudienceText);
			}
		}, 1000);

		return () => clearTimeout(delayDebounceFn);
	}, [searchAudienceText]);

	const age_min = form.watch('targeting.age_min');
	const age_max = form.watch('targeting.age_max');
	const demographics = form.watch('targeting.demographics');
	const interests = form.watch('targeting.interests');
	const behaviors = form.watch('targeting.behaviors');
	const custom_audience_list = form.watch('targeting.custom_audiences');

	return (
		<>
			<div>
				<div className='font-medium text-lg'>Audience Targeting</div>
			</div>
			<div className='grid gap-4'>
				<FormField
					control={form.control}
					name='targeting.geo_locations'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Select Locations <Asterisk />
							</FormLabel>
							<FormControl>
								<div>
									<div
										className='md:w-1/2 w-full text-left justify-start border border-gray-200 rounded-md p-2 inline-flex items-center hover:bg-gray-100 cursor-pointer'
										onClick={() => setOpenLocationDialog(true)}
									>
										<Search className='w-4 h-4 mr-2' />
										Select Locations
									</div>
									<LocationSelector
										open={openLocationDialog}
										setOpen={setOpenLocationDialog}
										placeholder='Search Locations'
										searchText={searchLocationText}
										setSearchText={setSearchLocationText}
										items={geoLocation}
										selectedItems={field.value ?? []}
										onChange={field.onChange}
										isLoading={isGeoLocationLoading}
									/>
								</div>
							</FormControl>
							<div className='flex flex-wrap gap-2'>
								<Each
									items={field.value ?? []}
									render={(item) => (
										<Badge className=' items-center'>
											<div>
												{item.name}, {item.country_name}
											</div>
											<XIcon
												className='w-4 h-4 cursor-pointer'
												onClick={() => {
													field.onChange(field.value.filter((v) => v.key !== item.key));
												}}
											/>
										</Badge>
									)}
								/>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='targeting.genders'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>
								Select Genders
								<Asterisk />
							</FormLabel>
							<FormControl>
								<Select
									defaultValue='0'
									value={
										field.value?.toString() === '1' || field.value?.toString() === '2'
											? field.value?.toString()
											: '0'
									}
									onValueChange={(value) => {
										if (value) {
											field.onChange([Number(value)]);
										} else {
											field.onChange([1, 2]);
										}
									}}
								>
									<SelectTrigger className='md:w-1/2 w-full'>
										<SelectValue placeholder='All' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='0'>All</SelectItem>
										<SelectItem value='1'>Male</SelectItem>
										<SelectItem value='2'>Female</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormItem>
					<FormLabel className='mb-0 mt-4'>Advance Targeting</FormLabel>
					<FormControl>
						<div>
							<div
								className='w-full md:w-1/2 text-left justify-start border border-gray-200 rounded-md p-2 inline-flex items-center hover:bg-gray-100 cursor-pointer'
								onClick={() => setOpenAudienceDialog(true)}
							>
								<Search className='w-4 h-4 mr-2' />
								Select audience
							</div>
							<AudienceSelector
								open={openAudienceDialog}
								setOpen={setOpenAudienceDialog}
								placeholder='Select Audience'
								searchText={searchAudienceText}
								setSearchText={setSearchAudienceText}
								items={{
									demographics: demographicsLists,
									interests: interestsLists,
									behaviors: behaviorsLists,
								}}
								selectedItems={{
									demographics: demographics,
									interests: interests,
									behaviors: behaviors,
								}}
								onChange={(value) => {
									form.setValue('targeting.demographics', value.demographics);
									form.setValue('targeting.interests', value.interests);
									form.setValue('targeting.behaviors', value.behaviors);
								}}
								isLoading={isAudienceLoading}
							/>
						</div>
					</FormControl>
					<div className='flex flex-wrap gap-2'>
						<Each
							items={demographics}
							render={(ele) => (
								<Badge className='bg-green-600 hover:bg-green-700 inline-flex items-center'>
									<div>{ele.name}</div>
									<XIcon
										className=' w-4 h-4 cursor-pointer'
										onClick={() => {
											form.setValue(
												'targeting.demographics',
												demographics.filter((v) => v.id !== ele.id)
											);
										}}
									/>
								</Badge>
							)}
						/>
						<Each
							items={interests}
							render={(ele) => (
								<Badge className='bg-cyan-800 hover:bg-cyan-900 inline-flex items-center'>
									<div>{ele.name}</div>
									<XIcon
										className='w-4 h-4 cursor-pointer'
										onClick={() => {
											form.setValue(
												'targeting.interests',
												interests.filter((v) => v.id !== ele.id)
											);
										}}
									/>
								</Badge>
							)}
						/>
						<Each
							items={behaviors}
							render={(ele) => (
								<Badge className='bg-blue-600 hover:bg-blue-700 inline-flex items-center'>
									<div>{ele.name}</div>
									<XIcon
										className=' w-4 h-4 cursor-pointer'
										onClick={() => {
											form.setValue(
												'targeting.behaviors',
												behaviors.filter((v) => v.id !== ele.id)
											);
										}}
									/>
								</Badge>
							)}
						/>
					</div>
					<FormMessage />
				</FormItem>
				<FormField
					control={form.control}
					name='targeting.custom_audiences'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='mb-0 mt-4'>Custom Audience</FormLabel>
							<FormControl>
								<div>
									<div
										className='w-full md:w-1/2 text-left justify-start border border-gray-200 rounded-md p-2 inline-flex items-center hover:bg-gray-100 cursor-pointer'
										onClick={() => setOpenCustomAudienceDialog(true)}
									>
										<Search className='w-4 h-4 mr-2' />
										Select custom audience
									</div>
									<CustomAudienceSelector
										open={openCustomAudienceDialog}
										setOpen={setOpenCustomAudienceDialog}
										placeholder='Select Audience'
										searchText={searchCustomAudienceText}
										setSearchText={setSearchCustomAudienceText}
										items={custom_audience.list}
										selectedItems={custom_audience_list}
										onChange={(value) => {
											form.setValue('targeting.custom_audiences', value);
										}}
									/>
								</div>
							</FormControl>
							<div className='flex flex-wrap gap-2'>
								<Each
									items={custom_audience.list.filter((v) => {
										return custom_audience_list.includes(v.id);
									})}
									render={(item) => (
										<Badge className=' items-center'>
											<div>{item.name}</div>
											<XIcon
												className='w-4 h-4 cursor-pointer'
												onClick={() => {
													form.setValue(
														'targeting.custom_audiences',
														custom_audience_list.filter((v) => v !== item.id)
													);
												}}
											/>
										</Badge>
									)}
								/>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormLabel className='mt-2'>
					Select age groups <Asterisk />
				</FormLabel>
				<div className='grid md:grid-cols-2 grid-cols-1 mt-2 w-full'>
					<FormItem>
						<FormControl>
							<RangeSlider
								values={[age_min ?? 13, age_max ?? 65]}
								onValuesChange={(values) => {
									form.setValue('targeting.age_min', values[0]);
									form.setValue('targeting.age_max', values[1]);
								}}
								rangeLabel='Age'
								min={13}
								max={65}
								step={1}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			</div>
		</>
	);
}
