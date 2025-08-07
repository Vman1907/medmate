'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
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
import APIWebhookService from '@/services/apiwebhook.service';
import { CheckCheck, Copy, RefreshCcw, Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteApiKey, deleteWebhook, validateWebhook } from '../action';

export function DeleteAPIKey({ id }: { id: string }) {
	const deleteAPIKey = () => {
		const promise = deleteApiKey(id);

		toast.promise(promise, {
			loading: 'Deleting API Key...',
			success: 'API Key deleted successfully',
			error: 'Failed to delete API Key',
		});
	};

	return (
		<DeleteDialog onDelete={deleteAPIKey} action='API Key'>
			<Button variant={'destructive'} size={'icon'}>
				<Trash className='w-4 h-4' />
			</Button>
		</DeleteDialog>
	);
}
export function DeleteWebhookButton({ id }: { id: string }) {
	const handleWebhookDelete = () => {
		const promise = deleteWebhook(id);

		toast.promise(promise, {
			loading: 'Deleting Webhook...',
			success: 'Webhook deleted successfully',
			error: 'Failed to delete Webhook',
		});
	};

	return (
		<DeleteDialog onDelete={handleWebhookDelete} action='Webhook'>
			<Button variant={'destructive'} size={'icon'}>
				<Trash className='w-4 h-4' />
			</Button>
		</DeleteDialog>
	);
}

export function ValidateWebhook({ id }: { id: string }) {
	const handleClick = () => {
		toast.promise(validateWebhook(id), {
			loading: 'Validating Webhook...',
			success: 'Webhook validated successfully',
			error: 'Failed to validate Webhook',
		});
	};

	return (
		<Button variant={'secondary'} size={'icon'} onClick={handleClick}>
			<CheckCheck className='w-4 h-4' />
		</Button>
	);
}

export function RegenerateAPIKey({ id }: { id: string }) {
	const [token, setToken] = useState('Generating...');
	const copyToken = () => {
		navigator.clipboard.writeText(token);
		toast.success('Token copied to clipboard');
	};
	const regenerateAPIKey = () => {
		const promise = APIWebhookService.RegenerateAPIKey(id);

		toast.promise(promise, {
			loading: 'Regenerating API Key...',
			success: (token) => {
				setToken(token);
				return 'API Key regenerated successfully';
			},
			error: 'Failed to regenerate API Key',
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'secondary'} size={'icon'} onClick={regenerateAPIKey}>
					<RefreshCcw className='w-4 h-4' />
				</Button>
			</DialogTrigger>

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
		</Dialog>
	);
}
