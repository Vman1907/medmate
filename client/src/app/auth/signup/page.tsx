import Loading from '@/components/elements/loading';
import { Suspense } from 'react';
import SignForm from './form';

export default async function Signup() {
	return (
		<Suspense fallback={<Loading />}>
			<SignForm />
		</Suspense>
	);
}
