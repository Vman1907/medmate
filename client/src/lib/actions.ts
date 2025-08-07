'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function revalidate(tag: string) {
	const cookieStore = cookies();
	const userId = cookieStore.get('user-id')?.value;
	revalidateTag(`${tag}-${userId}`);
}
