'use client';

import { useConversationStoreEffects } from '@/stores/conversation';
import RecipientsSection from './_components/organism/recipientsSection';
import ConversationScreen from './_components/organism/conversation-screen';

export default function ConversationsPage() {
	useConversationStoreEffects();
	return (
		<>
			<RecipientsSection />
			<ConversationScreen />
		</>
	);
}
