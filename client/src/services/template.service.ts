import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import RequestError from '@/lib/RequestError';
import { TemplateWithID } from '@/schema/template';

export default class TemplateService {
	static async listTemplates() {
		try {
			const { templates } = await apiClient.get<{
				templates: TemplateWithID[];
			}>(`/template`, {
				tags: [REVALIDATE_TAGS.TEMPLATE],
			});

			return templates;
		} catch (err) {
			return [];
		}
	}
	static async fetchTemplate(template_id: string) {
		try {
			const { template } = await apiClient.get<{
				template: TemplateWithID;
			}>(`/template/${template_id}`, {
				tags: [REVALIDATE_TAGS.TEMPLATE + `:${template_id}`],
			});

			return {
				...template,
				header: template.header || {
					format: 'NONE',
				}
			};
		} catch (err) {
			return null;
		}
	}

	static async removeTemplate(id: string, name: string) {
		await apiClient.post(`/template/delete-template`, {
			id,
			name,
		});
		apiClient.revalidateTag(REVALIDATE_TAGS.TEMPLATE);
		apiClient.revalidateTag(REVALIDATE_TAGS.TEMPLATE + `:${id}`);
	}

	static async addTemplate(template: Record<string, unknown>) {
		if (template.category === 'UTILITY') {
			delete template.header;
		}
		try {
			await apiClient.post(`/template/add-template`, template);
			apiClient.revalidateTag(REVALIDATE_TAGS.TEMPLATE);
		} catch (err: any) {
			if (err instanceof RequestError) {
				throw new Error(err.getMessage());
			}
			throw new Error('Unable to create ad');
		}
	}

	static async editTemplate(template: Record<string, unknown>) {
		try {
			await apiClient.post(`/template/edit-template`, template);
			apiClient.revalidateTag(REVALIDATE_TAGS.TEMPLATE + `:${template.id}`);
		} catch (err: any) {
			if (err instanceof RequestError) {
				throw new Error(err.getMessage());
			}
			throw new Error('Unable to create ad');
		}
	}
}
