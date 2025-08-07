'use client';
import { Paths, SLEEK_LOGO } from '@/lib/consts';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
	Menubar,
	MenubarContent,
	MenubarLink,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '../ui/menubar';
import { ThemeToggle } from '../ui/theme-toggle';
import AuthDialog from './dialogs/auth';

export default function Navbar() {
	function getLink(link: string) {
		return `/panel${link}`;
	}

	return (
		<Menubar className='  px-[2%] py-4 w-full'>
			<div className='md:flex hidden w-full'>
				<div className='flex gap-4 justify-between items-center w-full'>
					<div className='flex-1'>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME.LANDING}>
									<Image
										src={SLEEK_LOGO}
										alt='Medmate'
										width={120}
										height={100}
										className='text-white'
									/>
								</Link>
							</MenubarTrigger>
						</MenubarMenu>
					</div>
					<div className='flex gap-4'>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME.HOME_VISIT}>Home Visit</Link>
							</MenubarTrigger>
						</MenubarMenu>

						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME.CONSULTATION}>Consultation</Link>
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME.SERVICES}>Services</Link>
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME.CONTACT_US}>Contact Us</Link>
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<AuthDialog>
								<MenubarTrigger className='bg-primary rounded-full px-6 py-2 text-slate-50 dark:text-slate-800 dark:bg-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900'>
									Login
								</MenubarTrigger>
							</AuthDialog>
						</MenubarMenu>
						<ThemeToggle hideText />
					</div>
				</div>
			</div>
			<div className='md:hidden'>
				<MenubarMenu>
					<MenubarTrigger>
						<MenuIcon className='w-6 h-6' />
					</MenubarTrigger>
					<MenubarContent>
						<MenubarSub>
							<MenubarSubTrigger>Dashboard</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarLink href={getLink('/home/dashboard')}>Dashboard</MenubarLink>
								<MenubarSeparator />
								<MenubarLink href={getLink('/home/tasks')}>Tasks</MenubarLink>
								<MenubarSeparator />
								<MenubarLink href={getLink('/home/agents')}>Agents</MenubarLink>
							</MenubarSubContent>
						</MenubarSub>
						<MenubarSub>
							<MenubarSubTrigger>Audience & Media</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarLink href={getLink('/audience/phonebook')}>Phonebook</MenubarLink>
								<MenubarSeparator />
								<MenubarLink href={getLink('/audience/media')}>Media</MenubarLink>
								<MenubarLink href={getLink('/audience/contacts')}>VCards</MenubarLink>
								<MenubarSeparator />
								<MenubarLink href={getLink('/audience/message-link')}>Message Links</MenubarLink>
							</MenubarSubContent>
						</MenubarSub>
						<MenubarSub>
							<MenubarSubTrigger>Campaigns</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarLink href={getLink('/campaigns/templates')}>Templates</MenubarLink>
								<MenubarSeparator />
								<MenubarLink href={getLink('/campaigns/broadcast')}>Campaign</MenubarLink>
								<MenubarLink href={getLink('/campaigns/recurring')}>Recurring Campaign</MenubarLink>
								<MenubarLink href={getLink('/campaigns/report')}>Campaign Report</MenubarLink>
								<MenubarSeparator />
								<MenubarLink href={getLink('/campaigns/chatbot-flow')}>Chatbot Flow</MenubarLink>
								<MenubarLink href={getLink('/campaigns/whatsapp-flow')}>Whatsapp Forms</MenubarLink>
							</MenubarSubContent>
						</MenubarSub>
						<MenubarLink href={getLink('/conversations')}>Chats</MenubarLink>
						<MenubarSub>
							<MenubarSubTrigger>Ads</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarLink href={getLink('/ads/setup')}>Setup</MenubarLink>
								<MenubarLink href={getLink('/ads/create')}>Create Ad</MenubarLink>
								<MenubarLink href={getLink('/ads/ads-manager')}>Ads Manager</MenubarLink>
								<MenubarLink href={getLink('/ads/custom-audience')}>Custom Audience</MenubarLink>
							</MenubarSubContent>
						</MenubarSub>
					</MenubarContent>
				</MenubarMenu>
			</div>
		</Menubar>
	);
}
