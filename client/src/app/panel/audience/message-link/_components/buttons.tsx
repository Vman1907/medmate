'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import MessageLinkService from '@/services/message-link.service';
import { DownloadIcon, EditIcon, QrCodeIcon, Trash } from 'lucide-react';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { PiExport } from 'react-icons/pi';
import { bulkDeleteMessageLink, deleteMessageLink } from '../actions';
import { QRDialog } from './dialogs';

export function EditButton() {
	return (
		<Button size={'icon'} variant={'outline'} className='border-blue-600 w-8 h-8'>
			<EditIcon className='w-4 h-4 text-blue-600' />
		</Button>
	);
}

export function DeleteButton({ id }: { id: string }) {
	const handleDelete = () => {
		toast.promise(deleteMessageLink(id), {
			loading: 'Deleting...',
			success: 'Deleted successfully',
			error: 'Failed to delete',
		});
	};

	return (
		<DeleteDialog onDelete={handleDelete} action='Message Link'>
			<Button variant={'outline'} size={'icon'} className='border-red-600 w-8 h-8 '>
				<Trash className='w-4 h-4 text-red-600' strokeWidth={2} />
			</Button>
		</DeleteDialog>
	);
}

export function DeleteSelectionButton({ ids }: { ids: string[] }) {
	const handleDelete = () => {
		// const promises = ids.map((id) => deleteMessageLink(id));
		// toast.promise(Promise.all(promises), {
		// 	loading: 'Deleting...',
		// 	success: 'Deleted successfully',
		// 	error: (err) => {
		// 		return 'Failed to delete';
		// 	},
		// });
		toast.promise(bulkDeleteMessageLink(ids), {
			loading: 'Deleting...',
			success: 'Deleted successfully',
			error: 'Failed to delete',
		});
	};

	return (
		<DeleteDialog onDelete={handleDelete} action='Message Link'>
			<Button variant={'destructive'} size={'sm'}>
				<Trash className='w-4 h-4 mr-1' strokeWidth={2} />
				Delete
			</Button>
		</DeleteDialog>
	);
}
export function ViewQrButton({ src }: { src: string }) {
	return (
		<QRDialog src={src}>
			<Button variant={'outline'} size={'icon'} className='border-primary w-8 h-8'>
				<QrCodeIcon className='w-4 h-4' />
			</Button>
		</QRDialog>
	);
}

export function ExportButton({ ids }: { ids: string[] }) {
	const handleExport = () => {
		toast.promise(MessageLinkService.exportLinks(ids), {
			loading: 'Downloading...',
			success: 'Downloaded successfully',
			error: (err) => {
				return 'Failed to download';
			},
		});
	};

	return (
		<Button size={'sm'} variant={'outline'} onClick={handleExport}>
			<PiExport className='w-4 h-4 mr-1' />
			Export
		</Button>
	);
}

export function DownloadButton({ ids, children }: { ids: string[]; children?: ReactNode }) {
	const handleDownload = async () => {
		const promise = MessageLinkService.downloadQrCode(ids);

		toast.promise(promise, {
			loading: 'Downloading...',
			success: 'Downloaded successfully',
			error: (err) => {
				return 'Failed to download';
			},
		});
	};

	return (
		<Button
			variant={'outline'}
			size={children ? 'sm' : 'icon'}
			className={`border-yellow-600 text-yellow-600 ${children ? '' : 'w-8 h-8'}`}
			onClick={handleDownload}
		>
			{children ? children : <DownloadIcon className='w-4 h-4 text-yellow-600' />}
		</Button>
	);
}
