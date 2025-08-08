import { cn } from '@/lib/utils';
import { IconMedicineSyrup, IconTableColumn } from '@tabler/icons-react';
import { Database, Headset, HomeIcon, Microscope, Search, Stethoscope } from 'lucide-react';

export function FeaturesSectionDemo() {
	const features = [
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
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-14 max-w-7xl mx-auto'>
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
