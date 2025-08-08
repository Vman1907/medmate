'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingDots() {
	const [dotCount, setDotCount] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setDotCount((prev) => (prev % 3) + 1);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='inline-flex items-center gap-0'>
			Loading
			<AnimatePresence mode='wait'>
				<motion.span
					key={dotCount}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className='min-w-[12px] inline-block'
				>
					{'.'.repeat(dotCount)}
				</motion.span>
			</AnimatePresence>
		</div>
	);
}
