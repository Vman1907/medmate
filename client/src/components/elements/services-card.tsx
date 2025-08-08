'use client';

import { IconMedicineSyrup, IconTableColumn } from '@tabler/icons-react';
import { Database, Headset, HomeIcon, Microscope, Search, Stethoscope } from 'lucide-react';
import Each from '../containers/each';
import CaseStudyCard from '../ui/card-case-study';

const services = [
	{
		title: 'Doctor on Call',
		description: 'Consult with expert doctors 24/7',
		// header: <Skeleton />, // Uncomment if you want to use a skeleton
		icon: <HomeIcon className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Home Nursing Care',
		description: 'Convenient doorstep delivery of essentials.',
		// header: <Skeleton />,
		icon: <Stethoscope className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Lab Tests at Home',
		description: 'Hassle free sample collection and tests.',
		// header: <Skeleton />,
		icon: <Microscope className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Emergency Ambulance',
		description: 'Quick and reliable medical transport.',
		// header: <Skeleton />,
		icon: <IconTableColumn className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Medical delivery',
		description: 'Convenient doorstep delivery of essentials.',
		// header: <Skeleton />,
		icon: <IconMedicineSyrup className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Secure Health Records',
		description: 'Access your health records anytime, anywhere.',
		// header: <Skeleton />,
		icon: <Database className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Specialist Finder',
		description: 'Find the right specialist for your needs.',
		// header: <Skeleton />,
		icon: <Search className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: '24/7 Support',
		description: 'Get assistance whenever you need it.',
		// header: <Skeleton />,
		icon: <Headset className='h-4 w-4 text-neutral-500' />,
	},
];

export default function ServicesCard() {
	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-8 items-center mx-auto'>
			<Each
				items={services}
				render={(service) => (
					<CaseStudyCard
						title={service.description}
						category={service.title}
						image='https://images.unsplash.com/photo-1675285410608-ddd6bb430b19?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						type='content'
					/>
				)}
			/>
		</div>
	);
}
