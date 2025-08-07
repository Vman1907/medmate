import MessagesService from '@/services/messages.service';
import UserService from '@/services/users.service';
import { Recipient } from '@/types/recipient';
import { useEffect } from 'react';
import { create } from 'zustand';

type UITag = 'archived' | 'pinned' | 'unread' | 'bot_active';
type ConversationStatus =
	| 'active'
	| 'inactive'
	| 'interacted_chatbot'
	| 'interacting_chatbot'
	| 'requesting_intervention'
	| 'intervened'
	| 'all';

type ConversationState = {
	recipients: Recipient[];
	filters: {
		search_text: string;
		ui_tags: UITag[];
		status: ConversationStatus;
		agent_filter: string[];
		label_filter: string[];
		message_label_filter: string[];
	};
	message_tags: string[];
	active_recipient: Recipient | null;
	selected_recipients: string[];
	ui_state: {
		chat_expanded: boolean;
	};
	loading: {
		loading_recipients: boolean;
		loading_more_recipients: boolean;
	};
	pagination: {
		next_cursor_id: string | null;
		next_cursor_timestamp: string | null;
	};
	fetchRecipients: (abortController: AbortController) => Promise<void>;
	loadMoreRecipients: () => Promise<void>;
	toggleSelectedRecipient: (id: string) => void;
	setFilters: (filters: Partial<ConversationState['filters']>) => Promise<void>;
	updateRecipient: (id: string, updates: Partial<Recipient>) => Promise<void>;
	markNewMessage: (id: string, count: number) => Promise<void>;
	markRead: (id: string) => Promise<void>;
	loadMessageTags: () => Promise<void>;
	setActiveRecipient: (recipient: Recipient) => void;
	setUIState: (ui_state: Partial<ConversationState['ui_state']>) => Promise<void>;
};

export const useConversationStore = create<ConversationState>((set, get) => ({
	recipients: [],
	filters: {
		search_text: '',
		ui_tags: [],
		status: 'requesting_intervention',
		agent_filter: [],
		label_filter: [],
		message_label_filter: [],
	},
	ui_state: {
		chat_expanded: true,
	},
	message_tags: [],
	active_recipient: null,
	selected_recipients: [],
	loading: {
		loading_recipients: false,
		loading_more_recipients: false,
	},
	pagination: {
		next_cursor_id: null,
		next_cursor_timestamp: null,
	},

	fetchRecipients: async (abortController: AbortController) => {
		const filters = get().filters;
		set({
			loading: {
				loading_recipients: true,
				loading_more_recipients: false,
			},
		});

		try {
			const { recipients, next_cursor_id, next_cursor_timestamp } =
				await MessagesService.fetchAllConversation({
					label_filter: filters.label_filter,
					status: filters.status,
					ui_tags: filters.ui_tags,
					query: filters.search_text,
					signal: abortController.signal,
				});

			set({
				recipients: recipients,
				loading: {
					loading_recipients: false,
					loading_more_recipients: false,
				},
				pagination: {
					next_cursor_id,
					next_cursor_timestamp,
				},
			});
		} catch (error: any) {
			if (error.name === 'AbortError') {
				return;
			}
			console.error('Failed to fetch conversations:', error);
			set({
				loading: {
					loading_recipients: false,
					loading_more_recipients: false,
				},
			});
		}
	},

	loadMoreRecipients: async () => {
		const pagination = get().pagination;
		const filters = get().filters;
		if (!pagination.next_cursor_id || !pagination.next_cursor_timestamp) return;

		set({
			loading: {
				loading_recipients: false,
				loading_more_recipients: true,
			},
		});

		try {
			const { recipients, next_cursor_id, next_cursor_timestamp } =
				await MessagesService.fetchAllConversation({
					label_filter: filters.label_filter,
					status: filters.status,
					ui_tags: filters.ui_tags,
					query: filters.search_text,
					next_cursor_id: pagination.next_cursor_id,
					next_cursor_timestamp: pagination.next_cursor_timestamp,
				});

			set({
				recipients: [...get().recipients, ...recipients],
				loading: {
					loading_recipients: false,
					loading_more_recipients: false,
				},
				pagination: {
					next_cursor_id,
					next_cursor_timestamp,
				},
			});
		} catch (error: any) {
			if (error.name === 'AbortError') {
				return;
			}
			console.error('Failed to fetch conversations:', error);
			set({
				loading: {
					loading_recipients: false,
					loading_more_recipients: false,
				},
			});
		}
	},

	loadMessageTags: async () => {
		const message_tags = await UserService.listMessageTags();
		set({
			message_tags,
		});
	},
	setActiveRecipient: (recipient: Recipient) => {
		set({
			active_recipient: recipient,
		});
	},

	toggleSelectedRecipient: (id: string) => {
		set((state) => {
			return {
				selected_recipients: state.selected_recipients.includes(id)
					? state.selected_recipients.filter((recipientId) => recipientId !== id)
					: [...state.selected_recipients, id],
			};
		});
	},
	setFilters: async (filters: Partial<ConversationState['filters']>) => {
		set((state) => {
			return {
				filters: { ...state.filters, ...filters },
			};
		});
	},
	setUIState: async (ui_state: Partial<ConversationState['ui_state']>) => {
		set((state) => {
			return {
				ui_state: { ...state.ui_state, ...ui_state },
			};
		});
	},

	updateRecipient: async (id: string, updates: Partial<Recipient>) => {
		set((state) => {
			return {
				recipients: state.recipients.map((recipient) =>
					recipient.id === id ? { ...recipient, ...updates } : recipient
				),
			};
		});
	},

	markNewMessage: async (id: string, count: number) => {
		set((state) => {
			return {
				recipients: state.recipients.map((recipient) =>
					recipient.id === id ? { ...recipient, unreadCount: count } : recipient
				),
			};
		});
	},

	markRead: async (id: string) => {
		set((state) => {
			return {
				recipients: state.recipients.map((recipient) =>
					recipient.id === id ? { ...recipient, new_messages: 0 } : recipient
				),
			};
		});
	},
}));

export const useConversationStoreEffects = () => {
	const { filters } = useConversationStore();
	useEffect(() => {
		const abortController = new AbortController();
		useConversationStore.getState().fetchRecipients(abortController);

		return () => {
			abortController.abort();
		}; // clean up
	}, [filters]);

	useEffect(() => {
		useConversationStore.getState().loadMessageTags();
	}, []);
	useEffect(() => {
		const abortController = new AbortController();
		useConversationStore.getState().fetchRecipients(abortController);
		return () => {
			abortController.abort();
		};
	}, []);
	return null;
};
