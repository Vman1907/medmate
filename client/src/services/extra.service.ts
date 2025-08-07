import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';

type FAQ = { title: string; info: string };
type Testimonial = { description: string; name: string; title: string; photo_url: string };

export default class ExtraService {
	static async getFAQs() {
		try {
			const data = await apiClient.get<{ list: FAQ[] }>('/extras/faqs', {
				tags: [REVALIDATE_TAGS.FAQS_TESTIMONIALS],
			});
			return data.list;
		} catch (err) {
			return null;
		}
	}

	static async getTestimonials() {
		try {
			const data = await apiClient.get<{ list: Testimonial[] }>('/extras/testimonials', {
				tags: [REVALIDATE_TAGS.FAQS_TESTIMONIALS],
			});
			return data.list;
		} catch (err) {
			return null;
		}
	}

	static async createFAQs(list: { title: string; info: string }[]) {
		await apiClient.post('/extras/faqs', { list });
		await apiClient.revalidateTag(REVALIDATE_TAGS.FAQS_TESTIMONIALS);
	}

	static async createTestimonials(
		list: { title: string; name: string; photo_url: string; description: string }[]
	) {
		await apiClient.post('/extras/testimonials', { list });
		await apiClient.revalidateTag(REVALIDATE_TAGS.FAQS_TESTIMONIALS);
	}
}
