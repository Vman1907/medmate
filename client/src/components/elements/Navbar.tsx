'use client';
import { LOGO_WHITE } from '@/lib/consts';
import { cn } from '@/lib/utils';
import { CircleUserRound, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoClose } from 'react-icons/io5';
import Show from '../containers/show';
import { useDevices } from '../context/devicesState';
import { useSettingDialogState } from '../context/settingState';
import { useUserDetails } from '../context/user-details';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarLink,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '../ui/menubar';
import { LogoutButton } from './logout-button';

export default function Navbar({ numberHealth }: { numberHealth: string }) {
	const { isMaster, isAdmin } = useUserDetails();
	const userDetails = useUserDetails();
	const { setShowDevices: setDevices, currentDevice, devices } = useDevices();
	const { setSetting } = useSettingDialogState();
	const [numberVisible, setNumberVisible] = useState(false);

	const selectedDevice = devices.find((d) => d.id === currentDevice) || null;

	function getLink(link: string) {
		return `/panel${link}`;
	}

	function openSettings() {
		setSetting(true);
	}

	function openDevices() {
		setDevices(true);
	}

	return (
		<Menubar className=' backdrop-blur-sm px-[2%] py-4 border-t-0 border-x-0 border-b w-full'>
			<div className='md:flex hidden'>
				<MenubarMenu>
					<MenubarTrigger>Home</MenubarTrigger>
					<MenubarContent>
						<MenubarLink href={getLink('/home/dashboard')}>Dashboard</MenubarLink>
						<MenubarSeparator />
						<MenubarLink href={getLink('/home/tasks')}>Tasks</MenubarLink>
						<MenubarSeparator />
						<MenubarLink href={getLink('/home/agents')}>Agents</MenubarLink>
						<MenubarLink onClick={openDevices}>Devices</MenubarLink>
						<Show.ShowIf condition={isMaster || isAdmin}>
							<MenubarLink href={getLink('/home/api-webhook')}>API & Webhooks</MenubarLink>
						</Show.ShowIf>
						<Show.ShowIf condition={isMaster}>
							<MenubarSeparator />
							<MenubarLink href={getLink('/home/users')}>Users</MenubarLink>
							<MenubarLink href={getLink('/home/coupons')}>Coupons</MenubarLink>
							<MenubarLink href={getLink('/home/extras')}>Extras</MenubarLink>
						</Show.ShowIf>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Audience & Media</MenubarTrigger>
					<MenubarContent>
						<MenubarLink href={getLink('/audience/phonebook')}>Phonebook</MenubarLink>
						<MenubarSeparator />
						<MenubarLink href={getLink('/audience/media')}>Media</MenubarLink>
						<MenubarLink href={getLink('/audience/contacts')}>VCards</MenubarLink>
						<MenubarSeparator />
						<MenubarLink href={getLink('/audience/message-link')}>Message Links</MenubarLink>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Campaigns</MenubarTrigger>
					<MenubarContent>
						<MenubarLink href={getLink('/campaigns/templates')}>Templates</MenubarLink>
						<MenubarSeparator />
						<MenubarLink href={getLink('/campaigns/broadcast')}>Campaign</MenubarLink>
						<MenubarLink href={getLink('/campaigns/recurring')}>Recurring Campaign</MenubarLink>
						<MenubarLink href={getLink('/campaigns/report')}>Campaign Report</MenubarLink>
						<MenubarSeparator />
						<MenubarLink href={getLink('/campaigns/chatbot-flow')}>Chatbot Flow</MenubarLink>
						<MenubarLink href={getLink('/campaigns/whatsapp-flow')}>Whatsapp Forms</MenubarLink>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>
						<Link href={getLink('/conversations')}>Chats</Link>
					</MenubarTrigger>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Ads</MenubarTrigger>
					<MenubarContent>
						<MenubarLink href={getLink('/ads/setup')}>Setup</MenubarLink>
						<MenubarLink href={getLink('/ads/create')}>Create Ad</MenubarLink>
						<MenubarLink href={getLink('/ads/ads-manager')}>Ads Manager</MenubarLink>
						<MenubarLink href={getLink('/ads/custom-audience')}>Custom Audience</MenubarLink>
					</MenubarContent>
				</MenubarMenu>
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
								<MenubarLink onClick={openDevices}>Devices</MenubarLink>
								<Show.ShowIf condition={isMaster || isAdmin}>
									<MenubarLink href={getLink('/home/api-webhook')}>API & Webhooks</MenubarLink>
								</Show.ShowIf>
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
			<div className='flex-1' />
			{selectedDevice ? (
				<div className='text-primary text-sm hidden md:block transition'>
					{selectedDevice.verifiedName}:{' '}
					<span
						onClick={() => setNumberVisible((v) => !v)}
						className={cn(
							'hover:blur-0 transition-all duration-300 cursor-pointer',
							numberVisible ? 'blur-0' : 'blur-sm'
						)}
					>
						{selectedDevice.phoneNumber}:{' '}
					</span>
					<span
						className={cn(
							numberHealth === 'RED' && '!text-red-400',
							numberHealth === 'YELLOW' && '!text-yellow-400',
							numberHealth === 'GREEN' && '!text-green-900',
							'font-bold text-black'
						)}
					>
						{numberHealth}
					</span>
				</div>
			) : null}
			<MenubarMenu>
				<MenubarTrigger>
					<Avatar className='w-8 h-8 bg-gray-200'>
						<AvatarImage src='/profile.png' alt='settings' />
						<AvatarFallback>
							{userDetails?.name?.charAt(0).toUpperCase() || <CgProfile className='w-6 h-6' />}
						</AvatarFallback>
					</Avatar>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={openSettings}>
						<CircleUserRound className='mr-2' size={'1.2rem'} />
						Account Details
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<LogoutButton />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}

const HomeNavbar = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<nav className='w-full absolute md:fixed  top-0 bg-primary z-50 h-[60px] text-accent'>
			<div className='flex items-center px-4 md:px-[5%] h-full justify-start md:justify-between'>
				<div className='w-full md:w-fit h-full flex justify-between space-x-32 items-center'>
					<Link href='/' className='inline-flex items-end'>
						<div className='inline-flex items-end justify-center gap-3'>
							<Image src={LOGO_WHITE} alt='Logo' width={40} height={40} />
							<p className='text-accent font-bold text-2xl  p-0 m-0'>Wautopilot</p>
						</div>
					</Link>
					<div className='md:inline-block hidden'>
						<ul className='flex gap-12'>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/#works' className='hover:text-slate-300'>
									What we do
								</Link>
							</li>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/#who' className='hover:text-slate-300'>
									Who we are
								</Link>
							</li>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/#how' className='hover:text-slate-300'>
									How it works
								</Link>
							</li>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/docs-apiwebhook' className='hover:text-slate-300'>
									Developer Docs
								</Link>
							</li>
							{/* <li className={`relative cursor-pointer font-medium`}>
									<Link href='/#faq' className='hover:text-slate-300'>FAQ</Link>
								</li> */}
						</ul>
					</div>

					<div
						className={`absolute top-0 ${
							isExpanded ? 'right-0' : '-right-full'
						} w-full h-screen bg-primary z-50 flex justify-center md:hidden p-4 text-center transition-all duration-300`}
					>
						<ul className='flex gap-6 flex-col'>
							<li className={`text-center cursor-pointer font-medium w-screen px-4`}>
								<IoClose className='ml-auto w-6 h-6' onClick={() => setIsExpanded(false)} />
							</li>
							<li
								className={`relative cursor-pointer font-bold`}
								onClick={() => setIsExpanded(false)}
							>
								<Link href='/#works' className='hover:text-slate-300'>
									What we do
								</Link>
							</li>
							<li
								className={`relative cursor-pointer font-bold`}
								onClick={() => setIsExpanded(false)}
							>
								<Link href='/#who' className='hover:text-slate-300'>
									Who we are
								</Link>
							</li>
							<li
								className={`relative cursor-pointer font-bold`}
								onClick={() => setIsExpanded(false)}
							>
								<Link href='/#how' className='hover:text-slate-300'>
									How it works
								</Link>
							</li>
							<li
								className={`relative cursor-pointer font-bold`}
								onClick={() => setIsExpanded(false)}
							>
								<Link href='/docs-apiwebhook' className='hover:text-slate-300'>
									Developer Docs
								</Link>
							</li>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/auth/login'>
									<Button className='rounded-full bg-accent hover:bg-accent/90 text-primary '>
										<span className='font-semibold'>Login</span>
									</Button>
								</Link>
							</li>
							<li className={`relative cursor-pointer font-medium`}>
								<Link href='/auth/signup'>
									<Button className='rounded-full bg-accent hover:bg-accent/90 text-primary '>
										<span className='font-semibold'>Signup</span>
									</Button>
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className='inline-block '>
					<ul className='flex gap-6 items-center'>
						<li className={`relative cursor-pointer font-medium hidden md:inline-block`}>
							<Link href='/auth/login'>
								<Button className='rounded-full bg-accent hover:bg-accent/90 text-primary '>
									<span className='font-semibold'>Login</span>
								</Button>
							</Link>
						</li>
						<li className={`relative cursor-pointer font-medium hidden md:inline-block`}>
							<Link href='/auth/signup'>
								<Button className='rounded-full bg-accent hover:bg-accent/90 text-primary '>
									<span className='font-semibold'>Signup</span>
								</Button>
							</Link>
						</li>
						<li className='md:hidden'>
							<MenuIcon
								className='cursor-pointer'
								onClick={() => setIsExpanded(!isExpanded)}
								size={24}
							/>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export { HomeNavbar };
