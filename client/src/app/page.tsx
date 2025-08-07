import Navbar from '@/components/elements/Navbar';
import Footer from '@/components/elements/footer';
import { Button } from '@/components/ui/button';
import { HERO_IMAGE } from '@/lib/consts';
import Image from 'next/image';

export default async function Home() {
	return (
		<div className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px] min-h-screen'>
			<Navbar />
			<div className='relative flex min-h-screen flex-col justify-center overflow-hidden w-full rounded-md z-0'>
				<div className='relative flex w-full flex-1 justify-center isolate z-0 flex-col'>
					<div className='grid grid-cols-2 gap-4 w-full px-4 md:px-8 items-center justify-center'>
						<div>
							<div className='text-4xl font-medium mb-8'>
								<p>Priorities your health Experience</p>
								<p>with Exceptional Care.</p>
							</div>
							<p>
								Experience quality healthcare services at your doorstep – from doctor visits and lab
								tests to home nursing and OPD consultations. Convenient, reliable, and trusted by
								1345+ happy patients.
							</p>
						</div>
						<div>
							<Image src={HERO_IMAGE} width={540} height={540} alt='' />
						</div>
					</div>
					<div className='flex flex-col md:flex-row items-center justify-start gap-4 mt-8 ml-8'>
						<div className='flex flex-col items-center justify-center shadow-lg rounded-lg bg-white overflow-hidden'>
							<div className='flex flex-col items-center justify-center gap-2 p-4'>
								<div className='text-sm'>Doctor Home Visit</div>
								<Button className='!py-0 px-4 h-min'>Book Now</Button>
							</div>
							<div className='w-full aspect-video bg-red-500'></div>
							<img src='' />
						</div>
						<div className='flex flex-col items-center justify-center shadow-lg rounded-lg bg-white overflow-hidden'>
							<div className='flex flex-col items-center justify-center gap-2 p-4'>
								<div className='text-sm'>Doctor Home Visit</div>
								<Button className='!py-0 px-4 h-min'>Book Now</Button>
							</div>
							<div className='w-full aspect-video bg-red-500'></div>
							<Image src='' alt='' />
						</div>
						<div className='flex flex-col items-center justify-center shadow-lg rounded-lg bg-white overflow-hidden'>
							<div className='flex flex-col items-center justify-center gap-2 p-4'>
								<div className='text-sm'>Doctor Home Visit</div>
								<Button className='!py-0 px-4 h-min'>Book Now</Button>
							</div>
							<div className='w-full aspect-video bg-red-500'></div>
							<img src='' />
						</div>
						<div className='flex flex-col items-center justify-center shadow-lg rounded-lg bg-white overflow-hidden'>
							<div className='flex flex-col items-center justify-center gap-2 p-4'>
								<div className='text-sm'>Doctor Home Visit</div>
								<Button className='!py-0 px-4 h-min'>Book Now</Button>
							</div>
							<div className='w-full aspect-video bg-red-500'></div>
							<img src='' />
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
