'use client';

import { DepartmentType, HospitalType, LocationType } from '@/types/filters';
import * as React from 'react';

const MOCKED_DATA = {
	locations: [
		{ name: 'Mumbai', slug: 'mumbai' },
		{ name: 'Delhi', slug: 'delhi' },
		{ name: 'Bangalore', slug: 'bangalore' },
		{ name: 'Chennai', slug: 'chennai' },
		{ name: 'Hyderabad', slug: 'hyderabad' },
		{ name: 'Pune', slug: 'pune' },
		{ name: 'Ahmedabad', slug: 'ahmedabad' },
		{ name: 'Kolkata', slug: 'kolkata' },
	],
	hospitals: [
		{ name: 'Apollo Hospital', slug: 'apollo-hospital' },
		{ name: 'Fortis Hospital', slug: 'fortis-hospital' },
		{ name: 'Manipal Hospital', slug: 'manipal-hospital' },
		{ name: 'KIMS Hospital', slug: 'kims-hospital' },
		{ name: 'Ruby Hall Clinic', slug: 'ruby-hall-clinic' },
		{ name: 'Sterling Hospital', slug: 'sterling-hospital' },
		{ name: 'Tata Medical Center', slug: 'tata-medical-center' },
	],
	departments: [
		{ name: 'Cardiology', slug: 'cardiology' },
		{ name: 'Orthopedics', slug: 'orthopedics' },
		{ name: 'Dermatology', slug: 'dermatology' },
		{ name: 'Neurology', slug: 'neurology' },
		{ name: 'Pediatrics', slug: 'pediatrics' },
		{ name: 'Psychiatry', slug: 'psychiatry' },
		{ name: 'Gynecology', slug: 'gynecology' },
		{ name: 'Oncology', slug: 'oncology' },
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
