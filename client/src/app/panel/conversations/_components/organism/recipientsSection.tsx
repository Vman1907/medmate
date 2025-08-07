'use client';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation';
import { Recipient as TRecipient } from '@/types/recipient';
import RecipientFilter from '../molecules/recipient-filter';
import RecipientList from '../molecules/recipient-list';
export default function RecipientsSection() {
	const {
		ui_state: { chat_expanded },
		loading: { loading_recipients, loading_more_recipients },
		setUIState,
		recipients,
		setFilters,
		setActiveRecipient,
		loadMoreRecipients,
	} = useConversationStore();

	const handleRecipientClick = (item: TRecipient) => {
		setUIState({ chat_expanded: false });
		setActiveRecipient(item);
		// if (selected_recipient._id === item._id) return;
	};

	return (
		<div
			className={cn(
				`flex flex-col gap-2 md:border-r-2 overflow-hidden md:max-w-md md:min-w-[350px] bg-white p-2`,
				chat_expanded ? '!w-full' : '!hidden md:!flex'
			)}
		>
			<div className='pr-2 mr-1 md:!px-0 flex gap-x-1'>
				<div className='flex-1'>
					<Input
						type='text'
						className='text-sm'
						placeholder='🔍 Search here'
						onChange={(e) => setFilters({ search_text: e.target.value })}
					/>
				</div>
			</div>
			<RecipientFilter />
			<Separator />
			<div className='relative flex justify-center flex-col overflow-hidden'>
				<div
					className={`flex items-center self-center absolute ${
						loading_recipients ? 'top-5' : '-top-10'
					} z-10 gap-2 bg-primary-foreground rounded-full p-2 px-4 overflow-hidden transition-all duration-300`}
				>
					<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
					<p className='text-primary'>Loading...</p>
				</div>
				<RecipientList
					onLastReached={loadMoreRecipients}
					list={recipients}
					handleRecipientClick={handleRecipientClick}
				/>
				<div
					className={`absolute ${
						loading_more_recipients ? 'bottom-10' : '-bottom-10'
					} flex items-center justify-center w-max self-center z-10 gap-2 bg-primary-foreground rounded-full p-2 px-4 overflow-hidden transition-all duration-300`}
				>
					<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
					<p className='text-primary'>Loading More Conversations...</p>
				</div>
			</div>
		</div>
	);
}
