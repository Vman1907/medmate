export type FilterSelectedEvent = {
	type: 'doctor' | 'location' | 'hospital' | 'department';
	value: string;
};

export type LocationType = {
	name: string;
	slug: string;
};

export type HospitalType = {
	name: string;
	slug: string;
};

export type DepartmentType = {
	name: string;
	slug: string;
};
