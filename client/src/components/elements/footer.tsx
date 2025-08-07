import Link from 'next/link';
import { Button } from '../ui/button';

export default function Footer() {
	return (
		<footer className='bg-primary text-accent px-[7%]'>
			<div className='pt-16 pb-4 px-4%'>
				<div className='w-full flex flex-col md:flex-row text-center md:text-left gap-12 md:gap-8 py-[5rem]'>
					<div className='w-full md:w-1/5 flex flex-col text-center items-center md:items-start md:text-left'>
						<p className='underline underline-offset-8 font-medium'>Menu</p>
						<div className='mt-4'>
							<Link className='hover:text-slate-200' href='/terms'>
								<p>Home</p>
							</Link>
							<Link className='hover:text-slate-200' href='/terms'>
								<p>About Us</p>
							</Link>
							<Link className='hover:text-slate-200' href='/privacy'>
								<p>Services</p>
							</Link>
							<Link className='hover:text-slate-200' href='/disclaimer'>
								<p>Contact Us</p>
							</Link>
						</div>
					</div>
					<div className='w-full md:w-1/5 flex flex-col items-center md:items-start text-center md:text-left gap-0'>
						<p className='underline underline-offset-8 font-medium'>Link</p>
						<div className='mt-4'>
							<Link className='hover:text-slate-200' href='/terms'>
								<p>Home</p>
							</Link>
							<Link className='hover:text-slate-200' href='/terms'>
								<p>Home Visit</p>
							</Link>
							<Link className='hover:text-slate-200' href='/privacy'>
								<p>Services</p>
							</Link>
							<Link className='hover:text-slate-200' href='/disclaimer'>
								<p>Contact Us</p>
							</Link>
						</div>
					</div>
					<div className='w-full md:w-2/5 flex flex-col items-center md:items-start text-center md:text-left gap-0'>
						<p className='underline underline-offset-8 font-medium'>Get in touch</p>
						<div className='mt-4'>
							<p>Stellar Coaching & Consulting</p>
							<p>B-502, Sahara Apartment, Plot No. 11,</p>
							<p>Sector 6 Dwarka, Dwarka,</p>
							<p>New Delhi, Delhi 110075, India</p>
						</div>
					</div>
					<div className='w-full md:w-1/5 flex flex-col items-center md:items-start text-center md:text-left gap-0'>
						<Button variant={'secondary'} className='px-8'>
							Book A Consultation
						</Button>
					</div>
				</div>
				{/* <div className='flex justify-start items-center mt-8'>
					<Facebook />
					<Twitter className='ml-4' />
					<Linkedin className='ml-4' />
					<Instagram className='ml-4' />
				</div> */}
				<div className='flex flex-col md:flex-row items-center justify-center mt-8 w-full'>
					<p className='px-4 text-center'>Copyright ©</p>
				</div>
			</div>
		</footer>
	);
}
