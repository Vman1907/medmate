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
import { useState } from 'react';
import SearchDialog from './SearchDialog';

export default function ConsultationFilters() {
	const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
	const { locations, hospitals, departments } = useLocations();

	const handleSearchDialogClick = (event: FilterSelectedEvent) => {
		setIsSearchDialogOpen(false);
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
					<Select>
						<SelectTrigger>
							<SelectValue placeholder='Location' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All</SelectItem>
							<Each
								items={locations}
								render={(item) => <SelectItem value={item.slug}>{item.name}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-64'>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder='Hospital' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All</SelectItem>
							<Each
								items={hospitals}
								render={(item) => <SelectItem value={item.slug}>{item.name}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-64'>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder='Department' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All</SelectItem>
							<Each
								items={departments}
								render={(item) => <SelectItem value={item.slug}>{item.name}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-48'>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder='Gender' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={['All', 'Male', 'Female', 'Other']}
								render={(item) => <SelectItem value={item}>{item}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
				<div className='w-42 md:w-48'>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder='Experience' />
						</SelectTrigger>
						<SelectContent>
							<Each
								items={['All', '1-5 years', '5-10 years', '10-20 years', '20+ years']}
								render={(item) => <SelectItem value={item}>{item}</SelectItem>}
							/>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
