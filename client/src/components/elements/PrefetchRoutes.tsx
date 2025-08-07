'use client';
import { Paths } from '@/lib/consts';
import { debugPrint } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrefetchRoutes() {
	const router = useRouter();

	useEffect(() => {
		const prefetchAll = async () => {
			for (const route of Object.values(Paths)) {
				router.prefetch(`/panel${route}`);
				debugPrint('✅ Prefetched:', route);
			}
		};
		prefetchAll();
	}, [router]);

	return null;
}
