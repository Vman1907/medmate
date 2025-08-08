'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogoutButton() {
	const { logout, user } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error('Failed to logout');
		}
	};

	if (!user) {
		return null;
	}

	return (
		<Button variant='unstyled' onClick={handleLogout} className='flex items-center gap-2'>
			<LogOut className='h-4 w-4' />
			Logout
		</Button>
	);
}
