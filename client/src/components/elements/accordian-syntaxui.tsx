'use client';
import { motion, Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

interface AccordionItemProps {
	title: string;
	content: string;
	isExpanded: boolean;
	onToggle: () => void;
}

interface AccordionProps {
	items: Array<{
		title: string;
		content: string;
	}>;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isExpanded, onToggle }) => {
	const cardVariants: Variants = {
		collapsed: {
			height: '60px',
			transition: { type: 'spring', stiffness: 300, damping: 15 },
		},
		expanded: {
			height: 'auto',
			transition: { type: 'spring', stiffness: 300, damping: 15 },
		},
	};

	const contentVariants: Variants = {
		collapsed: { opacity: 0 },
		expanded: {
			opacity: 1,
			transition: { delay: 0.1 },
		},
	};

	const chevronVariants: Variants = {
		collapsed: { rotate: 0 },
		expanded: { rotate: 180 },
	};

	return (
		<motion.div
			className={`w-90 dark:bg-gray-800' my-4 h-full cursor-pointer select-none overflow-hidden rounded-lg border  dark:border-gray-700`}
			variants={cardVariants}
			initial='collapsed'
			animate={isExpanded ? 'expanded' : 'collapsed'}
			onClick={onToggle}
		>
			<div className='flex items-center justify-between p-4 text-gray-900 dark:text-gray-100'>
				<h2 className='m-0 text-sm font-semibold text-red-500'>{title}</h2>
				<motion.div variants={chevronVariants}>
					<ChevronDown size={18} />
				</motion.div>
			</div>
			<motion.div
				className='text-md select-none px-4 py-4'
				variants={contentVariants}
				initial='collapsed'
				animate={isExpanded ? 'expanded' : 'collapsed'}
			>
				<p className='m-0 text-sm text-gray-900 dark:text-gray-100'>{content}</p>
			</motion.div>
		</motion.div>
	);
};

const Accordion: React.FC<AccordionProps> = ({ items }) => {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	return (
		<div className='space-y-4'>
			{items.map((item, index) => (
				<AccordionItem
					key={index}
					title={item.title}
					content={item.content}
					isExpanded={expandedIndex === index}
					onToggle={() => handleToggle(index)}
				/>
			))}
		</div>
	);
};

const faqs = [
	{
		title: 'What is Medmate?',
		content:
			'Medmate is a healthcare service that brings medical care to your doorstep, offering 24/7 doctor home visits, nursing care, and blood sample collection.',
	},
	{
		title: 'What services do you provide?',
		content:
			'We offer: • Doctor home visits any time of the day or night. • Nursing care, like wound dressing, injections, and IV drips. • Blood sample collection and timely lab test reports.',
	},
	{
		title: 'Are your services available around the clock?',
		content: 'Yes, we are open 24/7 for doctor home visits, so help is always just a call away.',
	},
	{
		title: 'How soon can a doctor or nurse arrive?',
		content: 'Typically, we can send someone to your home within 60 to 90 minutes after booking.',
	},
	{
		title: 'What medical issues can you handle at home?',
		content:
			'We address non-emergency problems like fever, cough, cold, minor injuries, and chronic condition management.',
	},
	{
		title: 'Can I call for a doctor late at night?',
		content: 'Absolutely. Our services are available even during odd hours.',
	},
	{
		title: 'What does your nursing care include?',
		content:
			'We offer services such as: • Giving injections and IV drips. • Post-surgery care. • Elderly care. • Nebulization and catheterization.',
	},
	{
		title: 'How do I book a service?',
		content: 'You can book through our website, or by giving us a call.',
	},
	{
		title: 'Are there extra charges for urgent or late-night visits?',
		content:
			'There might be an additional fee for such cases. Our team will let you know before confirming your booking.',
	},
	{
		title: 'Do you treat children at home?',
		content:
			'Yes, we provide pediatric care, including consultations, vaccinations, and general health check-ups..',
	},
];

const FAQ: React.FC = () => {
	return (
		<div>
			<div className='p-8'>
				<Accordion items={faqs} />
			</div>
		</div>
	);
};

export default FAQ;
