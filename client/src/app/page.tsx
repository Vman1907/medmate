import Navbar from '@/components/elements/Navbar';
import Footer from '@/components/elements/footer';

export default async function Home() {
	return (
		<div className='h-screen overflow-x-hidden overflow-y-scroll pt=[70px] min-h-screen'>
			<Navbar />

			<Footer />
		</div>
	);
}
