import Navbar from '@/components/elements/Navbar';
import Footer from '@/components/elements/footer';

export default async function Home() {
	return (
		<div className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px] min-h-screen'>
			<Navbar />
			<section className='pt-24 bg-blue-50'>
				<div className='container mx-auto px-6 text-center'>
					<h2 className='text-4xl font-bold text-blue-900 mb-4'>Your Health, Our Priority</h2>
					<p className='text-lg text-gray-700 mb-6'>
						Providing quality care for your family with professional doctors.
					</p>
					<a
						href='/appointment'
						className='bg-blue-700 text-white px-6 py-3 rounded hover:bg-blue-800 transition'
					>
						Book Appointment
					</a>
				</div>
			</section>
			<Footer />
		</div>
	);
}
