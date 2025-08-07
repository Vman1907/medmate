'use client';

import Show from '@/components/containers/show';
import { useDevices } from '@/components/context/devicesState';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { revalidate } from '@/lib/actions';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { Copy, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createApiKey, createWebhook } from '../action';

export function CreateAPIKeyDialog() {
	const [token, setToken] = useState<string>('');

	const [selectedDevice, setSelectedDevice] = useState<string>('');
	const [name, setName] = useState<string>('');

	const { devices: devicesList } = useDevices();

	const devices = useMemo(() => {
		return devicesList.map((device) => ({ label: device.verifiedName, value: device.id }));
	}, [devicesList]);

	const copyToken = () => {
		toast.success('Token copied to clipboard');
		navigator.clipboard.writeText(token);
	};
	const handleSave = () => {
		if (!name || !selectedDevice) {
			return toast.error('Please fill all fields');
		}

		toast.promise(createApiKey(name, selectedDevice), {
			loading: 'Creating API Key...',
			success: (token) => {
				setToken(token);
				return 'API Key created successfully';
			},
			error: () => {
				return 'Failed to create API Key';
			},
		});
	};

	return (
		<Dialog
			onOpenChange={(value) => {
				if (!value) {
					setToken('');
					revalidate(REVALIDATE_TAGS.API_KEYS);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size={'sm'}>
					<Plus className='mr-2 w-4 h-4' />
					Create Token
				</Button>
			</DialogTrigger>
			<Show>
				<Show.When condition={!!token}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Token</DialogTitle>
						</DialogHeader>
						<div className='flex gap-2'>
							<div className='flex-1'>
								<Input value={token} readOnly placeholder='Token' />
							</div>
							<Button variant={'outline'} size={'icon'} onClick={copyToken}>
								<Copy />
							</Button>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant='secondary'>Close</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Show.When>

				<Show.Else>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create API key</DialogTitle>
						</DialogHeader>
						<div className='grid space-y-1'>
							<Label className='mb-0'>
								Name<span className='ml-[0.2rem] text-red-800'>*</span>
							</Label>
							<Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
							<Label className='mb-0'>
								Device<span className='ml-[0.2rem] text-red-800'>*</span>
							</Label>
							<Combobox
								placeholder='Select device'
								value={selectedDevice}
								items={devices}
								onChange={setSelectedDevice}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant='secondary'>Cancel</Button>
							</DialogClose>
							<Button onClick={handleSave}>Save</Button>
						</DialogFooter>
					</DialogContent>
				</Show.Else>
			</Show>
		</Dialog>
	);
}

export function CreateWebhookDialog() {
	const [selectedDevice, setSelectedDevice] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [url, setUrl] = useState<string>('');

	const { devices } = useDevices();

	const handleSave = () => {
		if (!name || !selectedDevice || !url) {
			toast.error('Please fill all fields');
			return;
		}

		// check if the url if in proper format
		const urlRegex = new RegExp('^(https?|ftp)://[a-zA-Z0-9-.]+.[a-zA-Z]{2,}(:[0-9]+)?(/.*)?$');

		if (!urlRegex.test(url)) {
			toast.error('Please enter a valid URL');
			return;
		}

		const promise = createWebhook(name, selectedDevice, url);

		toast.promise(promise, {
			loading: 'Creating Webhook...',
			success: () => {
				return 'Webhook created successfully';
			},
			error: () => {
				return 'Failed to create Webhook';
			},
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={'sm'}>
					<Plus className='mr-2 w-4 h-4' />
					Create Webhook
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Webhook</DialogTitle>
				</DialogHeader>
				<div className='grid space-y-1'>
					<Label className='mb-0'>
						Name<span className='ml-[0.2rem] text-red-800'>*</span>
					</Label>
					<Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
					<Label className='mb-0'>
						Device<span className='ml-[0.2rem] text-red-800'>*</span>
					</Label>
					<Combobox
						placeholder='Select device'
						value={selectedDevice}
						items={devices.map((device) => ({
							label: device.verifiedName,
							value: device.id,
						}))}
						onChange={setSelectedDevice}
					/>
					<Label className='mb-0'>
						URL<span className='ml-[0.2rem] text-red-800'>*</span>
					</Label>
					<Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder='URL' />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='secondary'>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={handleSave}>Save</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
