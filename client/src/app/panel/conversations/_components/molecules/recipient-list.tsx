import Each from '@/components/containers/each';
import { Recipient as TRecipient } from '@/types/recipient';
import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Recipient from './recipient';
import { useConversationStore } from '@/stores/conversation';

const RecipientList = memo(
	({
		list,
		onLastReached,
		handleRecipientClick,
	}: {
		list: TRecipient[];
		onLastReached: () => void;
		handleRecipientClick: (item: TRecipient) => void;
	}) => {
		const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

		const { active_recipient, selected_recipients } = useConversationStore();

		useEffect(() => {
			let id: NodeJS.Timeout;
			if (inView) {
				id = setTimeout(() => {
					onLastReached();
				}, 300);
			}
			return () => {
				clearTimeout(id);
			};
		}, [inView, onLastReached]);

		return (
			<div className='flex flex-col overflow-y-scroll overflow-x-hidden h-[calc(100vh-160px)] relative'>
				{
					<>
						<Each
							items={list}
							id={(t) => t.id}
							render={(item, index) => {
								if (index === list.length - 1 && list.length >= 100) {
									return (
										<div ref={inViewRef}>
											<Recipient
												onClick={handleRecipientClick}
												recipient={item}
												isConversationOpen={active_recipient?.id === item.id}
												isSelected={selected_recipients.includes(item.id)}
											/>
										</div>
									);
								} else {
									return (
										<div>
											<Recipient
												onClick={handleRecipientClick}
												recipient={item}
												isConversationOpen={active_recipient?.id === item.id}
												isSelected={selected_recipients.includes(item.id)}
											/>
										</div>
									);
								}
							}}
						/>
					</>
				}
			</div>
		);
	}
);

RecipientList.displayName = 'RecipientList';
export default RecipientList;
