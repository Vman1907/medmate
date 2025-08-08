import React from 'react';

import { cn } from '@/lib/utils';

interface CaseStudyCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	category?: string;
	image?: string;
	logo?: React.ReactNode;
	link?: string;
	type?: 'content' | 'simple-image'; // Decides between text or image
}

// ContentCard Component for rendering text + image
const ContentCard: React.FC<CaseStudyCardProps> = ({ title, category, image, logo }) => {
	return (
		<div
			className='relative flex h-full flex-col items-start justify-between rounded-lg bg-accent group w-full overflow-hidden'
			style={{
				backgroundImage: `url(${image})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{image && <div className='opacity-0 group-hover:opacity-60 rounded-lg absolute inset-0  bg-black' />}

			{logo && logo}
			<div className='relative z-10 flex flex-col justify-end h-full w-full'>
				{category && <div className='text-lg font-medium text-white dark:text-white from-transparent to-black bg-gradient-to-b p-4 block group-hover:hidden w-full'>{category}</div>}

				{title && (
					<div className='p-4 overflow-hidden hidden group-hover:block mr-2 text-sm font-bold leading-tight tracking-wide text-red-400 transition-all duration-300 ease-in-out'>
						{title}
					</div>
				)}
			</div>
		</div>
	);
};

// SimpleImageCard component for rendering only image
const SimpleImageCard: React.FC<CaseStudyCardProps> = ({ image }) => {
	return (
		<div
			className='relative flex w-full flex-col items-start justify-between rounded-lg p-4'
			style={{
				backgroundImage: `url(${image})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		/>
	);
};

const HoverRevealSlip = ({ show }: { show: React.ReactNode }) => {
	const common = 'absolute flex w-full h-full [backface-visibility:hidden]';

	return (
		<div className={cn('group relative h-60 w-52 [perspective:1000px]')}>
			{/* Back cover - static */}
			<div className={cn('absolute inset-0 h-full w-48 rounded-lg bg-gray-50 shadow-md')}></div>

			{/* Card container with slight book opening effect on hover */}
			<div
				className={cn(
					'relative z-50 h-full w-48 origin-left transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-30deg)]'
				)}
			>
				{/* Front side of the card */}
				<div className={cn('h-full w-full rounded-lg bg-white shadow-md', common)}>{show}</div>
			</div>

			{/* Sliding link/tab coming out from behind */}
			<div
				className={cn(
					'z-1 absolute bottom-0 right-0 flex h-48 w-14 -translate-x-10 transform items-start justify-start rounded-r-lg bg-green-600 pl-2 pt-2 text-xs font-bold text-white transition-transform duration-300 ease-in-out [backface-visibility:hidden] group-hover:translate-x-0 group-hover:rotate-[5deg]'
				)}
			>
				<div className='-rotate-90 whitespace-nowrap pb-16 pr-9'>CLICK TO READ</div>
			</div>
		</div>
	);
};

// Main CaseStudyCard Component
export default function CaseStudyCard({
	title,
	category,
	link,
	image,
	logo,
	type,
}: CaseStudyCardProps) {
	return (
		<div className='flex gap-8'>
			<a href={link} className='block'>
				<HoverRevealSlip
					show={
						type === 'content' ? (
							<ContentCard title={title} category={category} image={image} logo={logo} />
						) : (
							<SimpleImageCard image={image} title={title} />
						)
					}
				/>
			</a>
		</div>
	);
}
