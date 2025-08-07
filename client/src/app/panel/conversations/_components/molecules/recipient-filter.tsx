'use client';

import AgentSelector from '@/components/elements/popover/agents';
import TagsSelector from '@/components/elements/popover/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import AgentService from '@/services/agent.service';
import { useConversationStore } from '@/stores/conversation';
import { Headset, ListFilter } from 'lucide-react';
import toast from 'react-hot-toast';
import AgentFilter from '../atoms/agent-selector';

export default function RecipientFilter() {
	const {
		filters: { ui_tags, status, agent_filter },
		setFilters,
		message_tags,
		selected_recipients,
	} = useConversationStore();

	const handleAssignAgent = (agentId: string) => {
		if (selected_recipients.length === 0) return;
		if (selected_recipients.length === 0) {
			const promises = selected_recipients.map((recipient) => {
				return AgentService.removeConversationFromAgent(recipient);
			});

			toast.promise(Promise.all(promises), {
				loading: 'Assigning conversation to agent',
				success: 'Conversation assigned to agent',
				error: 'Failed to assign conversation to agent',
			});
			return;
		}
		const promises = selected_recipients.map((recipient) => {
			return AgentService.assignConversationToAgent({
				agentId,
				conversationId: recipient,
			});
		});

		toast.promise(Promise.all(promises), {
			loading: 'Assigning conversation to agent',
			success: () => {
				return 'Conversation assigned to agent';
			},
			error: 'Failed to assign conversation to agent',
		});
	};

	return (
		<>
			<div className='flex gap-x-2 overflow-x-auto min-h-max'>
				<Select value={status} onValueChange={(value) => setFilters({ status: value as any })}>
					<SelectTrigger className='min-w-max text-xs h-8 ring-0 outline-none focus:ring-0 focus:ring-offset-0'>
						<SelectValue className='text-xs' placeholder='Status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='requesting_intervention'>Requesting Intervention</SelectItem>
						<SelectItem value='intervened'>Intervened</SelectItem>
						<SelectItem value='interacting_chatbot'>Interacting Chatbot</SelectItem>
						<SelectItem value='interacted_chatbot'>Interacted Chatbot</SelectItem>
						<SelectItem value='active'>Active</SelectItem>
						<SelectItem value='inactive'>Inactive</SelectItem>
						<SelectItem value='all'>All</SelectItem>
					</SelectContent>
				</Select>

				{selected_recipients.length > 0 && (
					<AgentSelector onSubmit={([id]) => handleAssignAgent(id)}>
						<Button variant='secondary' size={'sm'}>
							<Headset className='w-4 h-4' />
						</Button>
					</AgentSelector>
				)}

				<Popover>
					<PopoverTrigger asChild>
						<Button variant='secondary' size={'sm'}>
							<ListFilter className='w-4 h-4' strokeWidth={3} />
						</Button>
					</PopoverTrigger>
					<PopoverContent side='right' className='p-1 w-fit'>
						<div className='flex gap-1'>
							<TagsSelector onChange={(tags) => setFilters({ label_filter: tags })}>
								<Button variant='outline' size={'sm'}>
									Tag Filter
								</Button>
							</TagsSelector>
							<TagsSelector
								labels={message_tags}
								onChange={(tags) => setFilters({ message_label_filter: tags })}
							>
								<Button variant='outline' size={'sm'}>
									Message Tag Filter
								</Button>
							</TagsSelector>
							<AgentFilter
								onConfirm={(agents) => setFilters({ agent_filter: agents })}
								selected={agent_filter}
							/>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<div className='flex gap-2 overflow-x-auto justify-center'>
				<Badge
					variant={ui_tags.includes('unread') ? 'default' : 'secondary'}
					onClick={() => {
						if (ui_tags.includes('unread')) {
							setFilters({ ui_tags: ui_tags.filter((t) => t !== 'unread') });
						} else {
							setFilters({ ui_tags: [...ui_tags, 'unread'] });
						}
					}}
					className='cursor-pointer'
				>
					Unread
				</Badge>
				<Badge
					variant={ui_tags.includes('pinned') ? 'default' : 'secondary'}
					onClick={() => {
						if (ui_tags.includes('pinned')) {
							setFilters({ ui_tags: ui_tags.filter((t) => t !== 'pinned') });
						} else {
							setFilters({ ui_tags: [...ui_tags, 'pinned'] });
						}
					}}
					className='cursor-pointer'
				>
					Pinned
				</Badge>
				<Badge
					variant={ui_tags.includes('archived') ? 'default' : 'secondary'}
					onClick={() => {
						if (ui_tags.includes('archived')) {
							setFilters({ ui_tags: ui_tags.filter((t) => t !== 'archived') });
						} else {
							setFilters({ ui_tags: [...ui_tags, 'archived'] });
						}
					}}
					className='cursor-pointer'
				>
					Archived
				</Badge>
			</div>
		</>
	);
}
