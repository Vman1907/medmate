import { cn } from '@/lib/utils';
import { IconUserHeart } from '@tabler/icons-react';
import { AlarmClock, Clock, Cpu, Heart, ShieldCheck, Syringe, Wallet } from 'lucide-react';

export function FeaturesSectionDemo() {
	const features = [
		{
			title: ' Excellence Assured',
			description: 'Expert Doctors With Proven Experience Best Medical',
			// header: <Skeleton />, // Uncomment if you want to use a skeleton
			icon: <ShieldCheck className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: 'Equipped & Ready',
			description: 'Fully equipped facilities ensuring top-quality care anytime.',
			// header: <Skeleton />,
			icon: <Syringe className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: 'Detailed Consultation',
			description: 'Personalized treatment plans designed for your needs.',
			// header: <Skeleton />,
			icon: <Heart className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: 'Timely Assistance',
			description: 'Fast response and minimal waiting time for patients',
			// header: <Skeleton />,
			icon: <AlarmClock className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: '24/7 Availability',
			description: 'Round-the-clock medical support for all emergencies.',
			// header: <Skeleton />,
			icon: <Clock className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: 'Advanced Technology',
			description: 'Modern diagnostic and treatment equipment at your service',
			// header: <Skeleton />,
			icon: <Cpu className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: 'Patient-Centered Care',
			description: 'Compassionate approach focusing on patient comfort.',
			// header: <Skeleton />,
			icon: <IconUserHeart className='h-4 w-4 text-neutral-500' />,
		},
		{
			title: 'Affordable Treatments',
			description: 'Quality healthcare that fits your budget without compromise.',
			// header: <Skeleton />,
			icon: <Wallet className='h-4 w-4 text-neutral-500' />,
		},
	];
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto'>
			{features.map((feature, index) => (
				<Feature key={feature.title} {...feature} index={index} />
			))}
		</div>
	);
}

const Feature = ({
	title,
	description,
	icon,
	index,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	index: number;
}) => {
	return (
		<div
			className={cn(
				'flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800',
				(index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800',
				index < 4 && 'lg:border-b dark:border-neutral-800'
			)}
		>
			{index < 4 && (
				<div className='opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none' />
			)}
			{index >= 4 && (
				<div className='opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none' />
			)}
			<div className='mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400'>{icon}</div>
			<div className='text-lg font-bold mb-2 relative z-10 px-10'>
				<div className='absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center' />
				<span className='group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100'>
					{title}
				</span>
			</div>
			<p className='text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10'>
				{description}
			</p>
		</div>
	);
};
