'use server';

import { Template } from '@/schema/template';
import TemplateService from '@/services/template.service';

export const createTemplate = async (details: Template) => {
	await TemplateService.addTemplate(details);
};

export const editTemplate = async (details: Template, id: string) => {
	await TemplateService.editTemplate({ ...details, id });
};

export const removeTemplate = async (id: string, name: string) => {
	await TemplateService.removeTemplate(id, name);
};
