import { DoctorType } from '@/types/doctor';
import { DOCTORS_MOCKED_DATA } from '../../mock/mockedData';
import DoctorsGrid from './_components/DoctorsGrid';
import { DoctorsList } from './_components/DoctorsList';
import ConsultationFilters from './_components/filters';
import { ConsultationHeading } from './_components/heading';

const getDoctors = async () => {
	return DOCTORS_MOCKED_DATA as DoctorType[];
};

export default async function Consultation({
	searchParams,
}: {
	searchParams: {
		filter_type?: string;
		filter_value?: string;
	};
}) {
	const { filter_type, filter_value } = searchParams;

	const doctors = await getDoctors();

	return (
		<div className='relative pt-[5%] px-[5%] md:px-[7%]'>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col gap-2 relative'>
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
				<div>
					<div>
						{!filter_type && !filter_value && (
							<div className='mt-6 relative'>
								<DoctorsGrid doctors={doctors.slice(0, 4)} />
							</div>
						)}
						{filter_type && filter_value && (
							<div className='mt-6 relative'>
								<DoctorsList doctors={doctors} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
