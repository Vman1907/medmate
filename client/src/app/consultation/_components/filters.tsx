'use client';
import Each from '@/components/containers/each';
import { useLocations } from '@/components/context/locations';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FilterSelectedEvent } from '@/types/filters';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SearchDialog from './SearchDialog';

export default function ConsultationFilters() {
	const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
	const { locations, hospitals, departments } = useLocations();
	const router = useRouter();
	const searchParams = useSearchParams();
	const location = searchParams.get('location') || '';
	const hospital = searchParams.get('hospital') || '';
	const department = searchParams.get('department') || '';
	const gender = searchParams.get('gender') || '';
	const experience = searchParams.get('experience') || '';

	function handleFilterChange(event: FilterSelectedEvent) {
		const url = new URLSearchParams();
		if (location) url.set('location', location);
		if (hospital) url.set('hospital', hospital);
		if (department) url.set('department', department);
		if (gender) url.set('gender', gender);
		if (experience) url.set('experience', experience);
		url.set(event.type, event.value);
		router.push(`/consultation?${url.toString()}`);
	}

	const handleSearchDialogClick = (event: FilterSelectedEvent) => {
		setIsSearchDialogOpen(false);
		const url = new URLSearchParams();
		url.set(event.type, event.value);
		router.push(`/consultation?${url.toString()}`);
	};

	return (
		<div>
			<PlaceholdersAndVanishInput
				placeholders={[
					'Find Your Perfect Doctor',
					'Search by Speciality',
					'Search by Location',
					'Search by Name',
				]}
				disabled
				onClick={() => setIsSearchDialogOpen(true)}
			/>
			<SearchDialog
				isOpen={isSearchDialogOpen}
				onOpenChange={setIsSearchDialogOpen}
				onClick={handleSearchDialogClick}
			/>
			<div className='flex flex-wrap gap-2 mt-4 justify-center items-center max-w-4xl mx-auto'>
				<div className='w-42 md:w-64'>
					<Select
						value={location}
						onValueChange={(value) => handleFilterChange({ type: 'location', value })}
					>
						<SelectTrigger>
							<SelectValue placeholder='Location' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={locations}
								render={(item) => <SelectItem value={item.slug}>{item.name}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-64'>
					<Select
						value={hospital}
						onValueChange={(value) => handleFilterChange({ type: 'hospital', value })}
					>
						<SelectTrigger>
							<SelectValue placeholder='Hospital' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={hospitals}
								render={(item) => <SelectItem value={item.slug}>{item.name}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-64'>
					<Select
						value={department}
						onValueChange={(value) => handleFilterChange({ type: 'department', value })}
					>
						<SelectTrigger>
							<SelectValue placeholder='Department' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={departments}
								render={(item) => <SelectItem value={item.slug}>{item.name}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-48'>
					<Select
						value={gender}
						onValueChange={(value) => handleFilterChange({ type: 'gender', value })}
					>
						<SelectTrigger>
							<SelectValue placeholder='Gender' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={['Male', 'Female', 'Other']}
								render={(item) => <SelectItem value={item}>{item}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-48'>
					<Select
						value={experience}
						onValueChange={(value) => handleFilterChange({ type: 'experience', value })}
					>
						<SelectTrigger>
							<SelectValue placeholder='Experience' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={['1-5 years', '5-10 years', '10-20 years', '20+ years']}
								render={(item) => <SelectItem value={item}>{item}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
