'use client';

import { IconMedicineSyrup, IconTableColumn } from '@tabler/icons-react';
import { Database, Headset, HomeIcon, Microscope, Search, Stethoscope } from 'lucide-react';
import Each from '../containers/each';
import CaseStudyCard from '../ui/card-case-study';

const services = [
	{
		title: 'Doctor on Call',
		description: 'Consult with expert doctors 24/7',
		images: '/images/doctor_on_call.png',
		icon: <HomeIcon className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Home Nursing Care',
		description: 'Convenient doorstep delivery of essentials.',
		images: '/images/nursing_feature.png',
		icon: <Stethoscope className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Lab Tests at Home',
		description: 'Hassle free sample collection and tests.',
		images: '/images/lab_at_home_feature.png',
		icon: <Microscope className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Emergency Ambulance',
		description: 'Quick and reliable medical transport.',
		images: '/images/ambulance_feature.png',
		icon: <IconTableColumn className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Medical delivery',
		description: 'Convenient doorstep delivery of essentials.',
		images: '/images/medical_delivery_feature.png',
		icon: <IconMedicineSyrup className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Secure Health Records',
		description: 'Access your health records anytime, anywhere.',
		images: '/images/secure_records_feature.png',
		icon: <Database className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: 'Specialist Finder',
		description: 'Find the right specialist for your needs.',
		images: '/images/finder_feature.png',
		icon: <Search className='h-4 w-4 text-neutral-500' />,
	},
	{
		title: '24/7 Support',
		description: 'Get assistance whenever you need it.',
		images: '/images/support_feature.png',
		icon: <Headset className='h-4 w-4 text-neutral-500' />,
	},
];

export default function ServicesCard() {
	return (
		<div className='grid grid-cols-2 md:grid-cols-4 justify-between w-full gap-8'>
			<Each
				items={services}
				render={(service) => (
					<CaseStudyCard
						title={service.description}
						category={service.title}
						image={service.images}
						type='content'
					/>
				)}
			/>
		</div>
	);
}
