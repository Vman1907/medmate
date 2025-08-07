'use client';
import { Paths } from '@/lib/consts';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useUserDetails } from '../context/user-details';
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

export default function Navbar() {
	const userDetails = useUserDetails();

	function getLink(link: string) {
		return `/panel${link}`;
	}

	return (
		<Menubar className='  px-[2%] py-4 border-t-0 border-x-0 border-b w-full'>
			<div className='md:flex hidden w-full'>
				<div className='flex gap-4 justify-between items-center w-full'>
					<div className='flex-1'>
						<MenubarMenu>
							<MenubarTrigger>
								<Link href={Paths.HOME.LANDING}>Home</Link>
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
								<Link href={Paths.AUTH.LOGIN}>Login</Link>
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger className=' px-4 py-2 rounded-full'>
								<Link href={Paths.HOME.CONTACT_US}>Contact Us</Link>
							</MenubarTrigger>
						</MenubarMenu>
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
