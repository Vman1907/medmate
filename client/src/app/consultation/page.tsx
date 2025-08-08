import ConsultationFilters from './_components/filters';
import { ConsultationHeading } from './_components/heading';

export default async function Consultation() {
	return (
		<div className='overflow-x-hidden overflow-y-scroll min-h-screen relative pt-[5%] px-[5%] md:px-[7%]'>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col gap-2'>
					<ConsultationHeading />
					<div className='text-2xl font-bold text-center text-primary'>
						Find Your Perfect Doctor
					</div>
					<div className='text-sm text-center text-muted-foreground'>
						Easily schedule in-clinic consultations with trusted doctors near you.{' '}
					</div>
					<div>
						<ConsultationFilters />
					</div>
				</div>
			</div>
		</div>
	);
}
