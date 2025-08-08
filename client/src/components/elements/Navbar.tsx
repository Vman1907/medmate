'use client';
import { useAuth } from '@/hooks/useAuth';
import { Paths } from '@/lib/consts';
import { LogOut, MenuIcon, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from '../ui/menubar';
import { ThemeToggle } from '../ui/theme-toggle';
import AuthDialog from './dialogs/auth';
import Logo from './logo';

export default function Navbar() {
	const { user, loading, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		setIsOpen(false);
		try {
			await logout();
			toast.success('Logged out successfully');
			router.push('/');
		} catch (error) {
			toast.error('Failed to logout');
		}
	};

	return (
		<Menubar className='  px-[2%] py-4 w-full'>
			<div className='md:flex hidden w-full'>
				<div className='flex gap-4 justify-between items-center w-full'>
					<div className='flex-1'>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.LANDING} className='inline-flex items-center gap-2'>
									<Logo />
								</Link>
							</MenubarTrigger>
						</MenubarMenu>
					</div>
					<div className='flex gap-4'>
						{user && (
							<MenubarMenu>
								<MenubarTrigger>
									<Link href={Paths.DASHBOARD}>Dashboard</Link>
								</MenubarTrigger>
							</MenubarMenu>
						)}

						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME_VISIT}>Home Visit</Link>
							</MenubarTrigger>
						</MenubarMenu>

						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.CONSULTATION}>Consultation</Link>
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.SERVICES}>Services</Link>
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.CONTACT_US}>Contact Us</Link>
							</MenubarTrigger>
						</MenubarMenu>
						{loading ? null : user ? (
							<MenubarMenu>
								<MenubarTrigger>
									<Avatar className='w-8 h-8 bg-gray-200'>
										<AvatarImage src='/profile.png' alt='settings' />
										<AvatarFallback>
											{user?.name?.charAt(0).toUpperCase() || <User className='w-6 h-6' />}
										</AvatarFallback>
									</Avatar>
								</MenubarTrigger>
								<MenubarContent>
									<Link href={Paths.PROFILE}>
										<MenubarItem>
											<User className='w-4 h-4 mr-2' />
											Account Details
										</MenubarItem>
									</Link>
									<MenubarSeparator />
									<MenubarItem onClick={handleLogout}>
										<LogOut className='h-4 w-4 mr-2' />
										Logout
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
						) : (
							<MenubarMenu>
								<AuthDialog>
									<MenubarTrigger className='bg-primary rounded-full px-6 py-2 text-slate-50 hover:text-slate-100 focus:text-slate-100 dark:text-slate-800 focus:dark:text-slate-900 dark:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900'>
										Login
									</MenubarTrigger>
								</AuthDialog>
							</MenubarMenu>
						)}
						<ThemeToggle hideText />
					</div>
				</div>
			</div>
			<div className='md:hidden flex justify-between w-full items-center'>
				<Button
					variant='ghost'
					className='bg-tr rounded-full p-2'
					onClick={() => setIsOpen(!isOpen)}
				>
					<MenuIcon className='w-6 h-6' />
				</Button>
				<div className='inline-flex flex-row items-center'>
					{loading ? null : user ? (
						<div className='ml-auto inline-flex flex-row items-center mt-2'>
							<Link
								href='/dashboard'
								className='text-sm underline border-r border-gray-700 pr-4'
								onClick={() => setIsOpen(false)}
							>
								Dashboard
							</Link>
							<Link
								href='/profile'
								className='text-sm underline border-r border-gray-700 pr-4'
								onClick={() => setIsOpen(false)}
							>
								Profile
							</Link>
						</div>
					) : (
						<AuthDialog>
							<Button className='bg-primary rounded-full px-6 py-2 text-slate-50 hover:text-slate-100 focus:text-slate-100 dark:text-slate-800 focus:dark:text-slate-900 dark:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900 ml-auto'>
								Login
							</Button>
						</AuthDialog>
					)}
					<div className='mt-2'>
						<span className='relative'>
							<ThemeToggle hideText />
						</span>
					</div>
				</div>
				{isOpen && (
					<div className='fixed top-0 left-0 bg-white dark:bg-slate-900 z-50 flex flex-col gap-4 p-4 min-w-[100vw] min-h-[100vh] justify-center items-center underline underline-offset-8'>
						<Link
							href={Paths.LANDING}
							onClick={() => setIsOpen(false)}
							className='inline-flex items-center gap-2 mb-32'
						>
							<Logo />
						</Link>
						<Link href={Paths.HOME_VISIT} onClick={() => setIsOpen(false)}>
							Home Visit
						</Link>
						<Link href={Paths.CONSULTATION} onClick={() => setIsOpen(false)}>
							Consultation
						</Link>
						<Link href={Paths.SERVICES} onClick={() => setIsOpen(false)}>
							Services
						</Link>
						<Link href={Paths.CONTACT_US} onClick={() => setIsOpen(false)}>
							Contact Us
						</Link>

						<Button variant='unstyled' onClick={handleLogout} className='flex items-center gap-2'>
							<LogOut className='h-4 w-4 mr-0' />
							Logout
						</Button>

						<Button
							variant='ghost'
							className='mt-12 bg-accent rounded-full p-2'
							onClick={() => setIsOpen(false)}
						>
							<X className='w-6 h-6' />
						</Button>
					</div>
				)}
			</div>
		</Menubar>
	);
}
