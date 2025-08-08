'use client';

import { Button } from '@/components/ui/button';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import { DoctorType } from '@/types/doctor';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

const DOCTORS_PER_PAGE = 10;

export function DoctorsList({ doctors }: { doctors: DoctorType[] }) {
	const [active, setActive] = useState<DoctorType | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const id = useId();
	const [currentPage, setCurrentPage] = useState(1);
	const listedDoctors = useMemo(() => {
		const startIndex = (currentPage - 1) * DOCTORS_PER_PAGE;
		const endIndex = startIndex + DOCTORS_PER_PAGE;
		return doctors.slice(startIndex, endIndex);
	}, [currentPage, doctors]);
	const totalPages = Math.ceil(doctors.length / DOCTORS_PER_PAGE);

	function handlePreviousPage() {
		setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
	}

	function handleNextPage() {
		setCurrentPage((prev) => (prev < totalPages ? prev + 1 : totalPages));
	}

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setActive(null);
			}
		}

		if (active && typeof active === 'object') {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [active]);

	useOutsideClick(ref, () => setActive(null));
	console.log('CURR PAGE', currentPage, totalPages);
	return (
		<>
			<div>
				<AnimatePresence>
					{active && typeof active === 'object' && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='fixed inset-0 bg-black/20 h-full w-full z-10'
						/>
					)}
				</AnimatePresence>
				<AnimatePresence>
					{active && typeof active === 'object' ? (
						<div className='fixed inset-0  grid place-items-center z-[100]'>
							<motion.button
								key={`button-${active.id}-${id}`}
								layout
								initial={{
									opacity: 0,
								}}
								animate={{
									opacity: 1,
								}}
								exit={{
									opacity: 0,
									transition: {
										duration: 0.05,
									},
								}}
								className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6'
								onClick={() => setActive(null)}
							>
								<CloseIcon />
							</motion.button>
							<motion.div
								layoutId={`card-${active.id}`}
								ref={ref}
								className='w-full max-w-xl  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden relative'
							>
								<motion.div layoutId={`image-${active.id}`}>
									<img
										width={200}
										height={200}
										src={active.image}
										alt={active.name}
										className='w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top'
									/>
								</motion.div>

								<div>
									<div className='flex justify-between items-start p-4'>
										<div className=''>
											<motion.h3
												layoutId={`title-${active.id}`}
												className='font-bold text-neutral-700 dark:text-neutral-200'
											>
												{active.name}
											</motion.h3>
											<motion.p
												layoutId={`description-${active.id}`}
												className='text-neutral-600 dark:text-neutral-400'
											>
												{active.education}
											</motion.p>
										</div>

										<motion.button
											layoutId={`button-${active.id}`}
											className='px-4 py-3 text-sm rounded-full font-bold bg-primary text-white'
										>
											Book Appointment
										</motion.button>
									</div>
									<div className='pt-4 relative px-4'>
										<motion.div
											layout
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className='text-neutral-600 text-xs md:text-sm lg:text-base md:max-h-[15rem] pb-10  overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]'
										>
											<div className='flex flex-col items-start gap-0 overflow-scroll '>
												<span>
													Speciality:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.speciality}
													</span>
												</span>
												<span>
													Hospital:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.hospital}
													</span>
												</span>
												<span>
													Department:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.department}
													</span>
												</span>
												<span>
													Region:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.region}
													</span>
												</span>
												<span>
													Experience:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.experience}
													</span>
												</span>
												<span>
													Certifications:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.certifications.join(', ')}
													</span>
												</span>
												<span>
													Affiliations:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.affiliations.join(', ')}
													</span>
												</span>
												<span>
													Services:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.services.join(', ')}
													</span>
												</span>
												<span>
													Availability:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.availability}
													</span>
												</span>
												<span>
													Language:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.language}
													</span>
												</span>
												<span>
													Rating:
													<span className='ml-2 text-neutral-800 dark:text-neutral-100'>
														{active.rating}
													</span>
												</span>
											</div>
										</motion.div>
									</div>
								</div>
								<div className='absolute bottom-0 left-0 right-0 p-4 flex justify-center'>
									<Link href={`/doctor/${active.id}`} target='_blank'>
										<Button
											variant='outline'
											className='px-6 rounded-full bg-neutral-100 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-500'
										>
											View Profile
										</Button>
									</Link>
								</div>
							</motion.div>
						</div>
					) : null}
				</AnimatePresence>
				<ul className='max-w-4xl mx-auto w-full gap-4 grid grid-cols-1'>
					{listedDoctors.map((doc) => (
						<motion.div
							layoutId={`card-${doc.id}`}
							key={`card-${doc.id}`}
							onClick={() => setActive(doc)}
							className={cn(
								'border border-neutral-200 dark:border-neutral-700',
								'p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer'
							)}
						>
							<div className='flex gap-4 flex-col md:flex-row '>
								<motion.div layoutId={`image-${doc.id}`}>
									<img
										width={200}
										height={200}
										src={doc.image}
										alt={doc.name}
										className='h-80 w-80 md:h-28 md:w-28 rounded-lg object-cover object-top'
									/>
								</motion.div>
								<div className=''>
									<motion.h3
										layoutId={`title-${doc.id}`}
										className='font-medium text-neutral-800 dark:text-neutral-100 text-center md:text-left'
									>
										{doc.name}
									</motion.h3>
									<motion.p
										layoutId={`description-${doc.id}`}
										className='text-neutral-700 dark:text-neutral-300 text-center md:text-left'
									>
										{doc.education}
									</motion.p>
									<motion.p
										layoutId={`experience-${doc.id}`}
										className='text-neutral-700 dark:text-neutral-300 text-center md:text-left'
									>
										{doc.experience}
									</motion.p>
									<motion.p
										layoutId={`consultancy-fee-${doc.id}`}
										className='text-neutral-700 dark:text-neutral-300 text-center md:text-left'
									>
										Consultancy Fee: {doc.price}
									</motion.p>
								</div>
							</div>
							<motion.button
								layoutId={`button-${doc.id}`}
								className='px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-primary hover:text-white text-black mt-4 md:mt-0'
							>
								More Details
							</motion.button>
						</motion.div>
					))}
				</ul>
			</div>
			<div className='mt-4' hidden={doctors.length <= DOCTORS_PER_PAGE}>
				<Pagination>
					<PaginationContent>
						<PaginationItem aria-disabled={currentPage <= 1}>
							<PaginationPrevious onClick={handlePreviousPage} />
						</PaginationItem>
						<PaginationItem hidden={currentPage <= 1}>
							<PaginationLink onClick={handlePreviousPage}>{currentPage - 1}</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink isActive>{currentPage}</PaginationLink>
						</PaginationItem>
						<PaginationItem hidden={currentPage >= totalPages}>
							<PaginationLink onClick={handleNextPage}>{currentPage + 1}</PaginationLink>
						</PaginationItem>
						<PaginationItem hidden={currentPage >= totalPages}>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem aria-disabled={currentPage >= totalPages}>
							<PaginationNext onClick={handleNextPage} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</>
	);
}

export const CloseIcon = () => {
	return (
		<motion.svg
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			exit={{
				opacity: 0,
				transition: {
					duration: 0.05,
				},
			}}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='h-4 w-4 text-black'
		>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M18 6l-12 12' />
			<path d='M6 6l12 12' />
		</motion.svg>
	);
};
