'use client';
import { Paths } from '@/lib/consts';
import { MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Menubar, MenubarMenu, MenubarTrigger } from '../ui/menubar';
import { ThemeToggle } from '../ui/theme-toggle';
import AuthDialog from './dialogs/auth';
import Logo from './logo';

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

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
						<MenubarMenu>
							<AuthDialog>
								<MenubarTrigger className='bg-primary rounded-full px-6 py-2 text-slate-50 hover:text-slate-100 focus:text-slate-100 dark:text-slate-800 focus:dark:text-slate-900 dark:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900'>
									Login
								</MenubarTrigger>
							</AuthDialog>
						</MenubarMenu>
						<ThemeToggle hideText />
					</div>
				</div>
			</div>
			<div className='md:hidden'>
				<Button
					variant='ghost'
					className='bg-tr rounded-full p-2'
					onClick={() => setIsOpen(!isOpen)}
				>
					<MenuIcon className='w-6 h-6' />
				</Button>
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
