'use client';

import { DepartmentType, HospitalType, LocationType } from '@/types/filters';
import * as React from 'react';

const LocationsContext = React.createContext<{
	locations: LocationType[];
	hospitals: HospitalType[];
	departments: DepartmentType[];
}>({
	locations: [],
	hospitals: [],
	departments: [],
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
