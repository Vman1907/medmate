import Each from '@/components/containers/each';
import { PinContainer } from '@/components/ui/3d-pin';
import { DoctorType } from '@/types/doctor';
import Image from 'next/image';

export default function DoctorsGrid({ doctors }: { doctors: DoctorType[] }) {
	return (
		<div>
			<h3 className='text-2xl font-bold text-primary'>Our Renowned Doctors</h3>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Each
					items={doctors}
					render={(doctor) => (
						<div className='h-[25rem] w-full flex items-center justify-center '>
							<PinContainer title={doctor.name} href={`/doctor/${doctor.id}`}>
								<div className='flex basis-full flex-col p-0 tracking-tight text-slate-100/50 sm:basis-1/2 w-[15rem] h-[15rem] '>
									<div className='relative flex flex-1 w-full rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500'>
										<Image
											src={doctor.image}
											alt={doctor.name}
											width={100}
											height={100}
											className='w-full h-full object-cover rounded-2xl'
										/>
										<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/70 flex flex-col p-4'>
											<h3 className='max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100 dark:text-slate-100'>
												{doctor.name}
											</h3>
											<div className='text-base !m-0 !p-0 font-normal'>
												<span className='text-slate-300 dark:text-slate-300 '>
													{doctor.speciality}
												</span>
											</div>
										</div>
									</div>
								</div>
							</PinContainer>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
