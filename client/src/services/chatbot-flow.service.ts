import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { ChatbotFlow } from '@/schema/chatbot-flow';
import { ChatbotFlow as TChatbotFlow } from '@/types/chatbot';
import UploadService from './upload.service';

type ChatbotFlowResponse = {
	bot_id: string;
	name: string;
	recipient: {
		include: string[];
		exclude: string[];
		allowed_labels: string[];
		restricted_labels: string[];
	};
	trigger: string[];
	options: string;
	isActive: boolean;
	trigger_gap_time: string;
	trigger_gap_type: 'DAY' | 'HOUR' | 'MINUTE' | 'SEC';
	trigger_gap_seconds: number;
	startAt: string;
	endAt: string;
	nurturing: {
		message: string;
		respond_type: string;
		images: string[];
		videos: string[];
		audios: string[];
		documents: string[];
		contacts: string[];
		template_id: string;
		template_name: string;
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: string;
			fallback_value: string;
		}[];
		template_header: {
			type: string;
			media_id: string;
			link: string;
			text: string[];
		};
		template_buttons: string[];
		template_carousel: {
			cards: string[];
		};
		after: {
			type: string;
			value: string;
		};
	}[];
	forward: {
		number: string[];
		respond_type: string;
		message: string;
		images: string[];
		videos: string[];
		audios: string[];
		documents: string[];
		contacts: string[];
		template_id: string;
		template_name: string;
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: string;
			fallback_value: string;
		}[];
		template_header: {
			type: string;
			media_id: string;
			link: string;
			text: string[];
		};
		template_buttons: string[][];
		template_carousel?: {
			cards: {
				header: {
					media_id: string;
				};
				body: {
					custom_text: string;
					phonebook_data: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
				}[];
				buttons: string[][];
			}[];
		};
		share_contact_card: {
			enabled: boolean;
			button_text: string;
		};
	};
	restrictIf: {
		chatbot_flow_id: string;
		chatbot_flow_name: string;
		condition: 'TRIGGER_KEYWORD' | 'FLOW_TRIGGERED';
	}[];
};

const validateChatBot = (bot: ChatbotFlowResponse) => {
	return {
		id: bot.bot_id ?? '',
		name: bot.name ?? '',
		recipient: bot.recipient ?? {
			include: [],
			exclude: [],
			allowed_labels: [],
			restricted_labels: [],
		},
		trigger: bot.trigger ?? [],
		options: bot.options ?? '',
		isActive: bot.isActive ?? false,
		trigger_gap_time: (bot.trigger_gap_seconds % 86400 === 0
			? bot.trigger_gap_seconds / 86400
			: bot.trigger_gap_seconds % 3600 === 0
			? bot.trigger_gap_seconds / 3600
			: bot.trigger_gap_seconds % 60 === 0
			? bot.trigger_gap_seconds / 60
			: bot.trigger_gap_seconds
		).toString(),
		trigger_gap_type:
			bot.trigger_gap_seconds % 86400 === 0
				? 'DAY'
				: bot.trigger_gap_seconds % 3600 === 0
				? 'HOUR'
				: bot.trigger_gap_seconds % 60 === 0
				? 'MINUTE'
				: 'SEC',
		startAt: bot.startAt ?? '',
		endAt: bot.endAt ?? '',
		nurturing: (bot.nurturing ?? []).map((nurturing: any) => ({
			message: nurturing.message ?? '',
			respond_type: nurturing.respond_type ?? 'normal',
			images: nurturing.images ?? [],
			videos: nurturing.videos ?? [],
			audios: nurturing.audios ?? [],
			documents: nurturing.documents ?? [],
			contacts: nurturing.contacts ?? [],
			template_id: nurturing.template_id ?? '',
			template_name: nurturing.template_name ?? '',
			template_body: (nurturing.template_body ?? []).map((body: any) => ({
				custom_text: body.custom_text ?? '',
				phonebook_data: body.phonebook_data ?? '',
				variable_from: body.variable_from ?? 'custom_text',
				fallback_value: body.fallback_value ?? '',
			})),
			template_header: {
				type: nurturing.template_header?.type ?? 'NONE',
				media_id: nurturing.template_header?.media_id ?? '',
				link: nurturing.template_header?.link ?? '',
				text: nurturing.template_header?.text?.map((text: any) => ({
					custom_text: text.custom_text ?? '',
					phonebook_data: text.phonebook_data ?? '',
					variable_from: text.variable_from ?? 'custom_text',
					fallback_value: text.fallback_value ?? '',
				})),
			},
			template_buttons: nurturing.template_buttons ?? [],
			template_carousel: {
				cards: nurturing.template_carousel?.cards ?? [],
			},
			after: {
				type:
					nurturing.after % 86400 === 0
						? 'days'
						: nurturing.after % 3600 === 0
						? 'hours'
						: nurturing.after % 60 === 0
						? 'min'
						: 'sec',
				value: (nurturing.after % 86400 === 0
					? nurturing.after / 86400
					: nurturing.after % 3600 === 0
					? nurturing.after / 3600
					: nurturing.after % 60 === 0
					? nurturing.after / 60
					: nurturing.after
				).toString(),
			},
		})),
		forward: {
			number: bot.forward?.number ?? [],
			respond_type: bot.forward?.respond_type ?? 'normal',
			message: bot.forward?.message ?? '',
			images: bot.forward?.images ?? [],
			videos: bot.forward?.videos ?? [],
			audios: bot.forward?.audios ?? [],
			documents: bot.forward?.documents ?? [],
			contacts: bot.forward?.contacts ?? [],
			template_id: bot.forward?.template_id ?? '',
			template_name: bot.forward?.template_name ?? '',
			template_body: (bot.forward?.template_body ?? []).map((body: any) => ({
				custom_text: body.custom_text ?? '',
				phonebook_data: body.phonebook_data ?? '',
				variable_from: body.variable_from ?? 'custom_text',
				fallback_value: body.fallback_value ?? '',
			})),
			template_header: {
				type: bot.forward?.template_header?.type ?? 'NONE',
				media_id: bot.forward?.template_header?.media_id ?? '',
				link: bot.forward?.template_header?.link ?? '',
				text: bot.forward?.template_header?.text?.map((text: any) => ({
					custom_text: text.custom_text ?? '',
					phonebook_data: text.phonebook_data ?? '',
					variable_from: text.variable_from ?? 'custom_text',
					fallback_value: text.fallback_value ?? '',
				})),
			},
			template_buttons: bot.forward?.template_buttons ?? [],
			template_carousel: {
				cards: bot.forward?.template_carousel?.cards ?? [],
			},
			share_contact_card: {
				enabled: bot.forward?.share_contact_card?.enabled ?? false,
				button_text: bot.forward?.share_contact_card?.button_text ?? '',
			},
		},
		restrictIf: bot.restrictIf ?? [],
	} as ChatbotFlow;
};

export default class ChatbotFlowService {
	static async listChatBots(): Promise<ChatbotFlow[]> {
		try {
			const data = await apiClient.get<{ flows: ChatbotFlowResponse[] }>(`/chatbot`, {
				tags: [REVALIDATE_TAGS.CHATBOT],
			});
			return data.flows.map(validateChatBot);
		} catch (err) {
			return [];
		}
	}
	static async createChatbotFlow(details: TChatbotFlow) {
		const data = await apiClient.post<{ flow: ChatbotFlowResponse }>(`/chatbot`, details);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT);
		return data.flow.bot_id;
	}
	static async findById(botId: string) {
		const { flow } = await apiClient.get<{ flow: ChatbotFlowResponse }>(`/chatbot/${botId}`, {
			tags: [REVALIDATE_TAGS.CHATBOT + `:${botId}`],
		});
		return validateChatBot(flow);
	}
	static async updateChatbotFlow({ bot_id, details }: { bot_id: string; details: TChatbotFlow }) {
		await apiClient.patch(`/chatbot/${bot_id}`, details);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT + `:${bot_id}`);
	}
	static async updateNodesAndEdges(botId: string, details: { nodes: any[]; edges: any[] }) {
		await apiClient.patch(`/chatbot/${botId}`, details);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT_NODES_AND_EDGES + `:${botId}`);
	}
	static async deleteChatbotFlow(botId: string) {
		await apiClient.delete(`/chatbot/${botId}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT + `:${botId}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT_NODES_AND_EDGES + `:${botId}`);
	}

	static async toggleChatbotFlow(botId: string) {
		await apiClient.put(`/chatbot/${botId}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT);
		await apiClient.revalidateTag(REVALIDATE_TAGS.CHATBOT + `:${botId}`);
	}

	static async getNodesAndEdges(botId: string) {
		try {
			const data = await apiClient.get<{
				flow: {
					nodes: any[];
					edges: any[];
				};
			}>(`/chatbot/${botId}`, {
				tags: [REVALIDATE_TAGS.CHATBOT_NODES_AND_EDGES + `:${botId}`],
			});
			return {
				nodes: data.flow.nodes,
				edges: data.flow.edges,
			};
		} catch (err) {
			return null;
		}
	}

	static async exportChatbotFlow(botId: string) {
		return await UploadService.downloadFile(
			`/chatbot/${botId}/download-responses`,
			'Chatbot Flow Report.csv'
		);
	}
}
