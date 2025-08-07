'use client';

import Asterisk from '@/components/elements/Asterisk';
import { Button } from '@/components/ui/button';
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
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { Popover } from '@radix-ui/react-popover';
import axios from 'axios';
import { EditIcon } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createMessageLink, editLink } from '../actions';

export function CreateLinkDialog({
	children,
	_message,
	id,
}: {
	children: ReactNode;
	_message?: string;
	id?: string;
}) {
	useEffect(() => {
		if (id) {
			setMessage(_message || '');
		}
	}, [_message, id]);

	const [message, setMessage] = useState('');
	const [noOfLinks, setNoOfLinks] = useState(1);
	const [isBulk, setIsBulk] = useState(false);

	const isValid = isBulk ? noOfLinks > 0 : message.length > 0;

	const handleCreate = () => {
		toast.promise(createMessageLink({ message, count: isBulk ? noOfLinks : 1 }), {
			loading: 'Creating links...',
			success: 'Links created successfully',
			error: 'Failed to create links',
		});
	};

	return (
		<Dialog onOpenChange={(open) => open && setMessage('')}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Create Link</DialogTitle>
				</DialogHeader>
				<Tabs
					onValueChange={(value) => setIsBulk(value === 'bulk')}
					defaultValue='single'
					className='w-full'
				>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='single'>Single</TabsTrigger>
						<TabsTrigger value='bulk'>Bulk</TabsTrigger>
					</TabsList>
					<TabsContent value='single'>
						<Label htmlFor='message' className='text-sm font-medium text-gray-700'>
							Prefilled Message <Asterisk />
						</Label>
						<Textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder='Enter your message'
						/>
					</TabsContent>
					<TabsContent value='bulk'>
						<Label className='text-sm font-medium text-gray-700'>No of Links</Label>
						<Input
							value={noOfLinks}
							onChange={(e) =>
								setNoOfLinks(isNaN(Number(e.target.value)) ? 1 : Number(e.target.value))
							}
							placeholder='Enter your message'
						/>
						<Label htmlFor='message' className='text-sm font-medium text-gray-700'>
							Prefilled Message
						</Label>
						<Textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder='Enter your message'
						/>
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<Button
						className='bg-primary text-white hover:bg-primary/80'
						onClick={handleCreate}
						disabled={!isValid}
					>
						Create
					</Button>
					<DialogClose>Cancel</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function EditDialog({ id, message }: { id: string; message: string }) {
	const [_message, setMessage] = useState(message);

	const handleEdit = () => {
		toast.promise(editLink(id, _message), {
			loading: 'Updating link...',
			success: 'Link updated successfully',
			error: 'Failed to update link',
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={'icon'} variant={'outline'} className='border-blue-600 text-primary w-8 h-8'>
					<EditIcon className='w-4 h-4 text-blue-600' />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Edit Link</DialogTitle>
				</DialogHeader>
				<Label htmlFor='message' className='text-sm font-medium text-gray-700'>
					Prefilled Message <Asterisk />
				</Label>
				<Textarea
					value={_message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Enter your message'
				/>

				<DialogFooter>
					<Button className='bg-primary text-white hover:bg-primary/80' onClick={handleEdit}>
						Save
					</Button>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function QRDialog({ children, src }: { children: React.ReactNode; src: string }) {
	const toDataURL = async (url: string) => {
		const response = await axios.get(url, { responseType: 'blob' });
		const imageDataUrl = URL.createObjectURL(response.data);

		return imageDataUrl;
	};

	const handleDownload = async () => {
		const a = document.createElement('a');
		a.href = await toDataURL(src);
		a.download = `Message_Link_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.svg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>QR Code</DialogTitle>
				</DialogHeader>
				<div>
					<div>Scan this QR code via whatsapp camera</div>
					<div className='flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4'>
						<img src={src} alt='QR Code' width={300} height={300} className='mx-auto mt-2' />
					</div>
				</div>

				<DialogFooter>
					<Button className='bg-primary text-white hover:bg-primary/80' onClick={handleDownload}>
						Download
					</Button>
					<DialogClose asChild>
						<Button variant={'destructive'}>Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function SelectRangePopover({
	selectRange,
}: {
	selectRange: (start: number, end: number) => void;
}) {
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(0);

	const handleSelection = () => {
		if (start > end) {
			toast.error('Start value should be less than end value');
			return;
		}
		if (start === end) {
			toast.error('Start and end value should not be same');
			return;
		}
		if (start < 0 || end < 0) {
			toast.error('Start and end value should be greater than 0');
			return;
		}
		selectRange(start, end);
		setStart(0);
		setEnd(0);
	};

	return (
		<Popover>
			<PopoverTrigger>
				<CaretDownIcon className='w-4 h-4 text-gray-500 hover:text-gray-700' />
			</PopoverTrigger>
			<PopoverContent className='w-auto p-4' align='start'>
				<div className='text-center'>Range Selection</div>
				<div className='flex gap-4 items-end justify-between'>
					<div className='flex gap-4 items-end justify-start'>
						<div>
							<Label className='text-sm font-medium text-gray-700'>Start</Label>
							<Input
								value={start}
								onChange={(e) =>
									setStart(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
								}
								className='h-8 w-20'
								placeholder='eg. 10'
							/>
						</div>
						<div>
							<Label className='text-sm font-medium text-gray-700'>End</Label>
							<Input
								value={end}
								onChange={(e) => setEnd(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))}
								className='h-8 w-20'
								placeholder='eg. 100'
							/>
						</div>
					</div>
				</div>
				<Button variant={'default'} className='w-full mt-2' size={'sm'} onClick={handleSelection}>
					Select
				</Button>
			</PopoverContent>
		</Popover>
	);
}
