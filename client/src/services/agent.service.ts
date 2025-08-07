import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { Agent } from '@/types/agent';
import { Permissions } from '@/types/permissions';

type AgentData = {
	list: Agent[];
};

type AgentTask = {
	id: string;
	hidden: boolean;
	message: string;
	due_date: string;
};

type AgentLogs = {
	agent_name: string;
	text: string;
	data: object;
	createdAt: string;
};

export default class AgentService {
	static async getAgents(): Promise<Agent[]> {
		try {
			const data = await apiClient.get<AgentData>('/users/agents', {
				tags: [REVALIDATE_TAGS.AGENTS],
			});
			return data.list.map((agent: any) => {
				return {
					id: agent.id ?? '',
					name: agent.name ?? '',
					email: agent.email ?? '',
					phone: agent.phone ?? '',
					permissions: (agent.permissions ?? {}) as Permissions,
				};
			});
		} catch (err) {
			return [];
		}
	}

	static async createAgent(agent: {
		name: string;
		email: string;
		phone: string;
		password: string;
	}) {
		try {
			const data = await apiClient.post<Agent>('/users/agents', agent);
			apiClient.revalidateTag(REVALIDATE_TAGS.AGENTS);
			return data;
		} catch (err) {
			throw new Error('Email already exists');
		}
	}

	static async updateAgent(agent: {
		id: string;
		name: string;
		email: string;
		phone: string;
		password: string;
	}) {
		try {
			const data = await apiClient.post<Agent>(`/users/agents/${agent.id}`, agent);
			apiClient.revalidateTag(REVALIDATE_TAGS.AGENTS);
			return data;
		} catch (err) {
			throw new Error('Agent not found');
		}
	}

	static async updateAgentPassword(id: string, password: string) {
		try {
			await apiClient.patch(`/users/agents/${id}`, {
				password: password,
			});
		} catch (err) {
			throw new Error('Agent not found');
		}
	}

	static async deleteAgent(agentId: string) {
		await apiClient.delete(`/users/agents/${agentId}`);
		apiClient.revalidateTag(REVALIDATE_TAGS.AGENTS);
		apiClient.revalidateTag(REVALIDATE_TAGS.AGENTS + `:${agentId}`);
	}

	static async assignConversationToAgent({
		agentId,
		conversationId,
	}: {
		agentId: string;
		conversationId: string;
	}) {
		await apiClient.post(`/conversation/${conversationId}/assign-agent/${agentId}`);
	}

	static async assignConversationsToAgent(
		agentId: string,
		details: {
			phonebook_ids?: string[];
			numbers?: string[];
		}
	) {
		await apiClient.post(`/conversation/assign-agent/${agentId}`, details);
	}

	static async removeConversationFromAgent(conversationId: string) {
		await apiClient.post(`/conversation/${conversationId}/remove-agent`);
	}

	static async assignAgentPermission(agentId: string, permission: Permissions) {
		try {
			const data = await apiClient.post<Agent>(`/users/agents/${agentId}/permissions`, permission);
			apiClient.revalidateTag(REVALIDATE_TAGS.AGENTS);
			return {
				id: data.id ?? '',
				name: data.name ?? '',
				email: data.email ?? '',
				phone: data.phone ?? '',
				permissions: {
					broadcast: {
						create: data.permissions?.broadcast?.create ?? false,
						update: data.permissions?.broadcast?.update ?? false,
						report: data.permissions?.broadcast?.report ?? false,
						export: data.permissions?.broadcast?.export ?? false,
					},
					recurring: {
						create: data.permissions?.recurring?.create ?? false,
						update: data.permissions?.recurring?.update ?? false,
						delete: data.permissions?.recurring?.delete ?? false,
						export: data.permissions?.recurring?.export ?? false,
					},
					media: {
						create: data.permissions?.media?.create ?? false,
						update: data.permissions?.media?.update ?? false,
						delete: data.permissions?.media?.delete ?? false,
					},
					phonebook: {
						create: data.permissions?.phonebook?.create ?? false,
						update: data.permissions?.phonebook?.update ?? false,
						delete: data.permissions?.phonebook?.delete ?? false,
						export: data.permissions?.phonebook?.export ?? false,
					},
					chatbot: {
						create: data.permissions?.chatbot?.create ?? false,
						update: data.permissions?.chatbot?.update ?? false,
						delete: data.permissions?.chatbot?.delete ?? false,
						export: data.permissions?.chatbot?.export ?? false,
					},
					chatbot_flow: {
						create: data.permissions?.chatbot_flow?.create ?? false,
						update: data.permissions?.chatbot_flow?.update ?? false,
						delete: data.permissions?.chatbot_flow?.delete ?? false,
						export: data.permissions?.chatbot_flow?.export ?? false,
					},
					whatsapp_flow: {
						create: data.permissions?.chatbot_flow?.create ?? false,
						update: data.permissions?.chatbot_flow?.update ?? false,
						delete: data.permissions?.chatbot_flow?.delete ?? false,
						export: data.permissions?.chatbot_flow?.export ?? false,
					},
					contacts: {
						create: data.permissions?.contacts?.create ?? false,
						update: data.permissions?.contacts?.update ?? false,
						delete: data.permissions?.contacts?.delete ?? false,
					},
					template: {
						create: data.permissions?.template?.create ?? false,
						update: data.permissions?.template?.update ?? false,
						delete: data.permissions?.template?.delete ?? false,
					},
					buttons: {
						read: data.permissions?.buttons?.read ?? false,
						export: data.permissions?.buttons?.export ?? false,
					},
					auto_assign_chats: data.permissions?.auto_assign_chats ?? false,
					assigned_labels: data.permissions?.assigned_labels ?? [],
				},
			} as Agent;
		} catch (err) {
			throw new Error('You are not authorized to update permissions');
		}
	}

	static async getAgentLogs(agentId: string) {
		try {
			const data = await apiClient.getWithoutCache<{
				logs: AgentLogs[];
			}>(`/users/agents/${agentId}/logs`);
			return data.logs;
		} catch (err) {
			return null;
		}
	}

	static async transferConversationsToAgent({
		deviceId,
		agentId,
		agentTo,
	}: {
		deviceId: string;
		agentId: string;
		agentTo: string;
	}) {
		await apiClient.post(`/${deviceId}/conversation/transfer-agent/${agentId}/${agentTo}`);
	}

	static async hideAssignedTask(id: string) {
		try {
			const data = await apiClient.patch<{
				tasks: {
					id: string;
					hidden: boolean;
					message: string;
					due_date: string;
				}[];
			}>(`/users/tasks/${id}`);
			return data.tasks as {
				id: string;
				hidden: boolean;
				message: string;
				due_date: string;
			}[];
		} catch (err) {
			return [];
		}
	}

	static async getAssignedTasks(
		id: string,
		params: {
			date_from?: string;
			date_to?: string;
		}
	) {
		try {
			let path = id !== 'me' ? `/users/agents/${id}/tasks` : `/users/tasks`;

			const queryParams = new URLSearchParams();
			if (params.date_from) {
				queryParams.set('date_from', params.date_from);
			}
			if (params.date_to) {
				queryParams.set('date_to', params.date_to);
			}

			if (queryParams.toString()) {
				path += '?' + queryParams.toString();
			}

			const data = await apiClient.getWithoutCache<{
				tasks: AgentTask[];
			}>(path);
			return data.tasks;
		} catch (err) {
			return [];
		}
	}

	static async assignTask(message: string, due_date: string, assign_to?: string) {
		try {
			const data = await apiClient.post<{
				task: AgentTask[];
			}>('/users/tasks', { message, assign_to, due_date });
			return data.task as AgentTask[];
		} catch (err) {
			return [];
		}
	}
}
