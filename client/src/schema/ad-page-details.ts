import { z } from 'zod';

export const AdPageSetupSchema = z.object({
	is_registered: z.boolean(),
	ad_account_id: z.string(),
	page_id: z.string(),
	whatsapp_number: z.string(),
	is_number_verified: z.boolean(),
});

export type AdPageSetup = z.infer<typeof AdPageSetupSchema>;

export const AdSchema = z
	.object({
		daily_budget: z.number(),
		start_time: z.date(),
		end_time: z.date(),
		targeting: z.object({
			geo_locations: z
				.object({
					key: z.string(),
					name: z.string(),
					type: z.string(),
					country_code: z.string(),
					country_name: z.string(),
				})
				.array()
				.default([]),
			custom_audiences: z.array(z.string()).default([]),
			age_max: z.number().max(65).optional(),
			age_min: z.number().min(13).optional(),
			genders: z.array(z.number()).optional(),
			behaviors: z
				.array(
					z.object({
						id: z.string(),
						name: z.string(),
						type: z.string(),
					})
				)
				.default([]),
			interests: z
				.array(
					z.object({
						id: z.string(),
						name: z.string(),
						type: z.string(),
					})
				)
				.default([]),
			demographics: z
				.array(
					z.object({
						id: z.string(),
						name: z.string(),
						type: z.string(),
					})
				)
				.default([]),
		}),

		ad_type: z.enum(['photo', 'video']),
		ad_name: z.string().min(1, 'Name is required'),
		ad_message: z.string().min(1, 'Message is required'),
		ad_description: z.string().min(20, 'Description must be at least 20 characters'), //*headline of the ad
		ad_picture: z.string().url().min(1, 'Photo is required'),
		ad_video_id: z.string().optional(),
		ad_video_url: z
			.string()
			.default('')
			.refine((url) => {
				if (url.length > 0) {
					return url?.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/);
				}
				return true;
			}),
		ad_website_link: z.string().url().min(1, 'Website link is required'),
		autofill_message: z.string().min(1, 'Autofill message is required'),
		whatsapp_greeting_message: z.string().min(1, 'Whatsapp greeting message is required'),
	})
	.superRefine((data, ctx) => {
		if (data.daily_budget < 90) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Daily budget cannot be less than 90',
				path: ['daily_budget'],
			});
		}
		if (!data.ad_picture) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Photo is required',
				path: ['ad_picture'],
			});
		}
		if (data.ad_type === 'video' && !data.ad_video_id) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Video is required',
				path: ['ad_video_id'],
			});
		}
		if (data.start_time >= data.end_time) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'End date cannot be less than or equal to start date',
				path: ['end_time'],
			});
		}
		//start date and end date should be at least 24 hours apart
		const diff = data.end_time.getTime() - data.start_time.getTime();
		if (diff < 24 * 60 * 60 * 1000) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'End date should be at least 24 hours apart from start date',
				path: ['end_time'],
			});
		}
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		if (data.start_time < date) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Start date cannot be in the past',
				path: ['start_time'],
			});
		}
		if (data.targeting.geo_locations.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Location is required',
				path: ['targeting.geo_locations'],
			});
		}
	});

export type AdType = z.infer<typeof AdSchema>;
