import { get, set } from 'idb-keyval';

export async function cacheImageLocally(key: string, blob: Blob) {
	await set(key, blob);
}

export async function getCachedImage(key: string): Promise<string | null> {
	const blob = await get(key);
	if (!blob) return null;
	return URL.createObjectURL(blob);
}
