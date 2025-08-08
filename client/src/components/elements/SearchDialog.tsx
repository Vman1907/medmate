'use client';
import Each from '@/components/containers/each';
import { useLocations } from '@/components/context/locations';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { LoadingDots } from '@/components/ui/loading-dots';
import useDebounce from '@/hooks/useDebounce';
import { DoctorType } from '@/types/doctor';
import { DepartmentType, FilterSelectedEvent, HospitalType, LocationType } from '@/types/filters';
import { useEffect, useMemo, useState } from 'react';

export default function SearchDialog({
	isOpen,
	onOpenChange,
	onClick,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onClick: (event: FilterSelectedEvent) => void;
}) {
	const [isLoading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const { locations, hospitals, departments } = useLocations();
	const debouncedSearch = useDebounce(searchValue, 1500);
	const [doctors, setDoctors] = useState<DoctorType[]>([]);

	useEffect(() => {
		if (!isOpen) {
			setDoctors([]);
			setSearchValue('');
		}
	}, [isOpen]);

	useEffect(() => {
		if (debouncedSearch.length === 0) {
			setDoctors([]);
			return;
		}
		setLoading(true);
		//search doctors
		setTimeout(() => {
			setLoading(false);
		}, 5000);
	}, [debouncedSearch]);

	const isListEmpty = useMemo(() => {
		return (
			doctors.length === 0 &&
			locations.length === 0 &&
			hospitals.length === 0 &&
			departments.length === 0
		);
	}, [doctors, locations, hospitals, departments]);

	return (
		<CommandDialog open={isOpen} onOpenChange={onOpenChange}>
			<CommandInput
				placeholder='Search by name, location or doctor...'
				onValueChange={setSearchValue}
				value={searchValue}
			/>
			<CommandList>
				{isLoading ? (
					<CommandEmpty>
						<LoadingDots />
					</CommandEmpty>
				) : !isListEmpty ? (
					<FilteredCommandList
						locations={locations}
						hospitals={hospitals}
						departments={departments}
						doctors={doctors}
						onClick={onClick}
					/>
				) : (
					<CommandEmpty>No results found.</CommandEmpty>
				)}
			</CommandList>
		</CommandDialog>
	);
}

function FilteredCommandList(props: {
	locations: LocationType[];
	hospitals: HospitalType[];
	departments: DepartmentType[];
	doctors: DoctorType[];
	onClick: (event: FilterSelectedEvent) => void;
}) {
	const items = useMemo(() => {
		return [
			...(props.doctors.length > 0
				? [
						{
							heading: 'Doctors',
							items: props.doctors
								.map((doctor) => ({
									label: doctor.name,
									value: doctor.id,
								}))
								.slice(0, 5),
						},
				  ]
				: []),
			...(props.locations.length > 0
				? [
						{
							heading: 'Location',
							items: props.locations
								.map((location) => ({
									label: location.name,
									value: location.slug,
								}))
								.slice(0, 5),
						},
				  ]
				: []),
			...(props.hospitals.length > 0
				? [
						{
							heading: 'Hospital',
							items: props.hospitals
								.map((hospital) => ({
									label: hospital.name,
									value: hospital.slug,
								}))
								.slice(0, 5),
						},
				  ]
				: []),
			...(props.departments.length > 0
				? [
						{
							heading: 'Department',
							items: props.departments
								.map((department) => ({
									label: department.name,
									value: department.slug,
								}))
								.slice(0, 5),
						},
				  ]
				: []),
		];
	}, [props.doctors, props.locations, props.hospitals, props.departments]);
	if (items.length === 0) return null;
	return (
		<Each
			items={items}
			render={({ heading, items }) => (
				<CommandGroup heading={heading}>
					<Each
						items={items}
						render={(item) => (
							<CommandItem
								key={item.value}
								className='cursor-pointer'
								onSelect={() =>
									props.onClick({
										type: heading.toLowerCase() as FilterSelectedEvent['type'],
										value: item.value,
									})
								}
							>
								{item.label}
							</CommandItem>
						)}
					/>
				</CommandGroup>
			)}
		/>
	);
}
