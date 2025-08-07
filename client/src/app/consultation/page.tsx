import { ConsultationHeading } from './_components/heading';

export default async function Consultation() {
	return (
		<div className='overflow-x-hidden overflow-y-scroll min-h-screen relative'>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col gap-4'>
					<ConsultationHeading />
				</div>
			</div>
		</div>
	);
}
