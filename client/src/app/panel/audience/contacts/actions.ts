'use server';

import { Contact } from '@/schema/phonebook';
import ContactService from '@/services/contact.service';

export async function deleteContact(ids: string[]) {
	try {
		await ContactService.deleteContact(ids);
	} catch (error) {
		throw new Error('Failed to delete contact');
	}
}

export async function addContact(contact: Omit<Contact, 'id' | 'formatted_name'>) {
	try {
		await ContactService.addContact(contact);
	} catch (error) {
		throw new Error('Failed to add contact');
	}
}

export async function updateContact(contact: Omit<Contact, 'formatted_name'> & { id: string }) {
	try {
		await ContactService.updateContact(contact);
	} catch (error) {
		throw new Error('Failed to update contact');
	}
}

export async function assignLabels(phone_number: string, labels: string[] = []) {
	try {
		await ContactService.assignLabels(phone_number, labels);
	} catch (error) {
		throw new Error('Failed to assign labels');
	}
}
