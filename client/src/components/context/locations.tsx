'use client';

import { DepartmentType, HospitalType, LocationType } from '@/types/filters';
import * as React from 'react';

const MOCKED_DATA = {
	locations: [
		{ name: 'Location 1', slug: 'location-1' },
		{ name: 'Location 2', slug: 'location-2' },
		{ name: 'Location 3', slug: 'location-3' },
		{ name: 'Location 4', slug: 'location-4' },
		{ name: 'Location 5', slug: 'location-5' },
		{ name: 'Location 6', slug: 'location-6' },
		{ name: 'Location 7', slug: 'location-7' },
	],
	hospitals: [
		{ name: 'Hospital 1', slug: 'hospital-1' },
		{ name: 'Hospital 2', slug: 'hospital-2' },
		{ name: 'Hospital 3', slug: 'hospital-3' },
		{ name: 'Hospital 4', slug: 'hospital-4' },
		{ name: 'Hospital 5', slug: 'hospital-5' },
		{ name: 'Hospital 6', slug: 'hospital-6' },
		{ name: 'Hospital 7', slug: 'hospital-7' },
	],
	departments: [
		{ name: 'Department 1', slug: 'department-1' },
		{ name: 'Department 2', slug: 'department-2' },
		{ name: 'Department 3', slug: 'department-3' },
		{ name: 'Department 4', slug: 'department-4' },
		{ name: 'Department 5', slug: 'department-5' },
		{ name: 'Department 6', slug: 'department-6' },
		{ name: 'Department 7', slug: 'department-7' },
	],
};

const LocationsContext = React.createContext<{
	locations: LocationType[];
	hospitals: HospitalType[];
	departments: DepartmentType[];
}>({
	locations: MOCKED_DATA.locations,
	hospitals: MOCKED_DATA.hospitals,
	departments: MOCKED_DATA.departments,
});

export function LocationsProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: {
		locations: LocationType[];
		hospitals: HospitalType[];
		departments: DepartmentType[];
	};
}) {
	return (
		<LocationsContext.Provider
			value={{
				locations: data.locations,
				hospitals: data.hospitals,
				departments: data.departments,
			}}
		>
			{children}
		</LocationsContext.Provider>
	);
}

export const useLocations = () => {
	const { locations, hospitals, departments } = React.useContext(LocationsContext);
	return { locations, hospitals, departments };
};
