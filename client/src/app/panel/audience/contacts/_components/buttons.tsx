'use client';
import { usePermissions } from '@/components/context/user-details';
import ContactDialog from '@/components/elements/dialogs/contact';
import { Button } from '@/components/ui/button';
import { contactSchema } from '@/schema/phonebook';
import { ContactRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { addContact } from '../actions';

export function AddContact() {
	const permission = usePermissions().contacts.create;
	const [open, setOpen] = useState(false);

	const handleSave = (contact: z.infer<typeof contactSchema>) => {
		if (!permission) {
			toast.error('You do not have permission to create contact');
			return;
		}

		toast.promise(addContact(contact), {
			loading: 'Saving contact...',
			success: () => {
				setOpen(false);
				return 'Contact saved successfully';
			},
			error: 'Failed to save contact',
		});
	};

	if (!permission) return null;

	return (
		<>
			<Button size={'sm'} className='bg-teal-600 hover:bg-teal-700' onClick={() => setOpen(true)}>
				<ContactRound className='w-4 h-4 mr-2' />
				Add VCard
			</Button>
			{open && <ContactDialog onSave={handleSave} onClose={() => setOpen(false)} />}
		</>
	);
}
