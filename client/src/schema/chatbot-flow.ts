import { z } from 'zod';

export const ChatbotFlowSchema = z
	.object({
		id: z.string(),
		name: z.string().min(1, 'Name is required'),
		trigger: z.array(z.string().min(1, 'Trigger is required')),
		options: z.union([
			z.literal('INCLUDES_IGNORE_CASE'),
			z.literal('INCLUDES_MATCH_CASE'),
			z.literal('EXACT_IGNORE_CASE'),
			z.literal('EXACT_MATCH_CASE'),
			z.literal('ANYWHERE_MATCH_CASE'),
			z.literal('ANYWHERE_IGNORE_CASE'),
		]),
		recipient: z.object({
			include: z.array(z.string()).default([]),
			exclude: z.array(z.string()).default([]),
			allowed_labels: z.array(z.string()).default([]),
			restricted_labels: z.array(z.string()).default([]),
		}),
		trigger_gap_time: z.string().refine((value) => {
			if (isNaN(Number(value))) return false;
			return Number(value) > 0;
		}, 'Trigger gap time must be greater than 0'),
		trigger_gap_type: z.enum(['SEC', 'MINUTE', 'HOUR', 'DAY']).default('MINUTE'),
		startAt: z.string().default('10:00'),
		endAt: z.string().default('18:00'),
		isActive: z.boolean().default(false),
		restrictIf: z
			.array(
				z.object({
					chatbot_flow_id: z.string().trim(),
					chatbot_flow_name: z.string().trim(),
					condition: z.enum(['TRIGGER_KEYWORD', 'FLOW_TRIGGERED']),
				})
			)
			.default([]),
		nurturing: z.array(
			z.object({
				after: z.object({
					type: z.union([
						z.literal('sec'),
						z.literal('min'),
						z.literal('days'),
						z.literal('hours'),
					]),
					value: z.string(),
				}),
				respond_type: z.union([z.literal('template'), z.literal('normal')]),
				message: z.string(),
				images: z.array(z.string()),
				videos: z.array(z.string()),
				audios: z.array(z.string()),
				documents: z.array(z.string()),
				contacts: z.array(z.string()),
				template_id: z.string(),
				template_name: z.string(),
				template_header: z
					.object({
						type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'NONE']),
						text: z
							.array(
								z.object({
									custom_text: z.string().trim(),
									phonebook_data: z.string().trim().optional(),
									variable_from: z.enum(['custom_text', 'phonebook_data']),
									fallback_value: z.string().trim().optional(),
								})
							)
							.optional(),
						media_id: z.string().trim().optional(),
						link: z.string().trim().optional(),
					})
					.optional(),
				template_body: z
					.array(
						z.object({
							custom_text: z.string().trim(),
							phonebook_data: z.string().trim().optional(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							fallback_value: z.string().trim().optional(),
						})
					)
					.default([]),
				template_buttons: z.array(z.array(z.string().trim())).optional(),
				template_carousel: z
					.object({
						cards: z.array(
							z.object({
								header: z.object({
									media_id: z.string().trim(),
								}),
								body: z
									.array(
										z.object({
											custom_text: z.string().trim(),
											phonebook_data: z.string().trim().optional(),
											variable_from: z.enum(['custom_text', 'phonebook_data']),
											fallback_value: z.string().trim().optional(),
										})
									)
									.default([]),
								buttons: z.array(z.array(z.string().trim())).default([]),
							})
						),
					})
					.optional(),
			})
		),
		forward: z.object({
			number: z
				.string()
				.array()
				.transform((value) => value.map((data) => data.replace(/\D/g, '')))
				.default([]),
			respond_type: z.union([z.literal('template'), z.literal('normal')]),
			message: z.string().default(''),
			images: z.array(z.string()).default([]),
			videos: z.array(z.string()).default([]),
			audios: z.array(z.string()).default([]),
			documents: z.array(z.string()).default([]),
			contacts: z.array(z.string()).default([]),
			template_id: z.string(),
			template_name: z.string(),
			template_header: z
				.object({
					type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'NONE']),
					text: z
						.array(
							z.object({
								custom_text: z.string().trim(),
								phonebook_data: z.string().trim().optional(),
								variable_from: z.enum([
									'custom_text',
									'phonebook_data',
									'forward_data',
									'trigger',
									'message',
								]),
								fallback_value: z.string().trim().optional(),
							})
						)
						.optional(),
					media_id: z.string().trim().optional(),
					link: z.string().trim().optional(),
				})
				.optional(),
			template_body: z
				.array(
					z.object({
						custom_text: z.string().trim(),
						phonebook_data: z.string().trim().optional(),
						variable_from: z.enum([
							'custom_text',
							'phonebook_data',
							'forward_data',
							'trigger',
							'message',
						]),
						fallback_value: z.string().trim().optional(),
					})
				)
				.default([]),
			template_buttons: z.array(z.array(z.string().trim())).optional(),
			template_carousel: z
				.object({
					cards: z.array(
						z.object({
							header: z.object({
								media_id: z.string().trim(),
							}),
							body: z
								.array(
									z.object({
										custom_text: z.string().trim(),
										phonebook_data: z.string().trim().optional(),
										variable_from: z.enum([
											'custom_text',
											'phonebook_data',
											'forward_data',
											'trigger',
											'message',
										]),
										fallback_value: z.string().trim().optional(),
									})
								)
								.default([]),
							buttons: z.array(z.array(z.string().trim())).default([]),
						})
					),
				})
				.optional(),
			share_contact_card: z.object({
				enabled: z.boolean().default(false),
				button_text: z.string().default(''),
			}),
		}),
	})
	.superRefine((data, ctx) => {
		if (
			data.forward.number.length !== 0 &&
			data.forward.respond_type === 'template' &&
			data.forward.template_id.length === 0
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please provide a template to forward',
				path: ['forward'],
			});
		}

		if (
			data.forward.number.length !== 0 &&
			data.forward.respond_type === 'normal' &&
			data.forward.message.length === 0 &&
			data.forward.images.length === 0 &&
			data.forward.videos.length === 0 &&
			data.forward.audios.length === 0 &&
			data.forward.documents.length === 0 &&
			data.forward.contacts.length === 0
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please provide a message to forward',
				path: ['forward.message'],
			});
		}

		if (
			data.forward.share_contact_card.enabled &&
			data.forward.share_contact_card.button_text.length === 0
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please provide a button text for share contact card',
				path: ['forward.share_contact_card.button_text'],
			});
		}
	});

export type ChatbotFlow = z.infer<typeof ChatbotFlowSchema>;
