import Loading from '@/components/elements/loading';
import { Suspense } from 'react';
import { LoginForm } from './form';

export default async function Login() {
	return (
		<Suspense fallback={<Loading />}>
			<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
				<div className='w-full max-w-sm'>
					<LoginForm />
				</div>
			</div>
		</Suspense>
	);
}
