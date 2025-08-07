'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { usePermissions } from '@/components/context/user-details';
import ContactDialog from '@/components/elements/dialogs/contact';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { SearchBar } from '@/components/elements/searchbar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { contactSchema, ContactWithID } from '@/schema/phonebook';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { deleteContact, updateContact } from '../actions';

export function DataTable({ records: list }: { records: ContactWithID[] }) {
	const [searchText, setSearchText] = useState('');
	const [contact, setContact] = useState<ContactWithID | null>(null);
	const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
	const permissions = usePermissions().contacts;
	const records = list.filter(
		(record) =>
			record.formatted_name.toLowerCase().includes(searchText.toLowerCase()) ||
			record.phones.some(({ phone }) => phone.toLowerCase().includes(searchText.toLowerCase()))
	);

	const selectDeselectContact = () => {
		if (selectedContacts.length === records.length) {
			setSelectedContacts([]);
		} else {
			setSelectedContacts([...records.map((record) => record.id)]);
		}
	};

	const selectContact = (contact: ContactWithID) => {
		if (!selectedContacts.find((c) => c === contact.id)) {
			setSelectedContacts([...selectedContacts, contact.id]);
		} else {
			setSelectedContacts(selectedContacts.filter((c) => c !== contact.id));
		}
	};

	const handleContactUpdate = (data: z.infer<typeof contactSchema>) => {
		if (!contact) return;

		let promise;
		if (!permissions.update) {
			toast.error('You do not have permission to update contact');
			return;
		}
		promise = updateContact({ ...data, id: contact.id });

		toast.promise(promise, {
			loading: 'Saving contact...',
			success: () => {
				setContact(null);
				return 'Contact saved successfully';
			},
			error: 'Failed to save contact',
		});
	};

	const handleDeleteContact = () => {
		toast.promise(deleteContact(selectedContacts), {
			loading: 'Deleting...',
			success: () => {
				setSelectedContacts([]);
				return 'Contact deleted';
			},
			error: 'Failed to delete contact',
		});
	};

	return (
		<div className='w-full'>
			<div className='flex justify-end'>
				<div className='flex items-center rounded-lg p-2 w-[450px] '>
					<SearchBar
						onChange={setSearchText}
						onSubmit={setSearchText}
						placeholders={['Search by name', 'Search by phone']}
					/>
					<Show.ShowIf condition={selectedContacts.length > 0}>
						<DeleteDialog onDelete={handleDeleteContact} title='Delete Contacts' action='Contact'>
							<Button variant={'destructive'} size={'sm'} className='ml-2'>
								Delete
							</Button>
						</DeleteDialog>
					</Show.ShowIf>
				</div>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell className='w-[70px]'>
								<Checkbox
									className='mr-2'
									checked={
										selectedContacts.length === records.length ||
										(selectedContacts.length > 0 && 'indeterminate')
									}
									onCheckedChange={selectDeselectContact}
								/>
								S.No.
							</TableCell>
							<TableCell>Name</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Show>
							<Show.When condition={records.length === 0}>
								<TableRow>
									<TableCell colSpan={5} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							</Show.When>
							<Show.Else>
								<Each
									items={records}
									render={(record, index) => (
										<TableRow>
											<TableCell>
												<Checkbox
													className='mr-2'
													checked={selectedContacts.includes(record.id)}
													onCheckedChange={() => {
														selectContact(record);
													}}
												/>
												{index + 1}.
											</TableCell>
											<TableCell
												onClick={() => setContact(record)}
												className='w-full inline-block cursor-pointer'
											>
												{record.formatted_name}
											</TableCell>
										</TableRow>
									)}
								/>
							</Show.Else>
						</Show>
					</TableBody>
				</Table>
			</div>
			{contact && (
				<ContactDialog
					onSave={handleContactUpdate}
					defaultValues={contact}
					onClose={() => setContact(null)}
				/>
			)}
		</div>
	);
}
