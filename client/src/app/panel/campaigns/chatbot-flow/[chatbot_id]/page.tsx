import { CHATBOT_DEFAULT_VALUE } from '@/lib/consts';
import { ChatbotFlowSchema } from '@/schema/chatbot-flow';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import ChatbotFlowForm from './form';

export default async function ChatbotFlowPage({ params }: { params: { chatbot_id: string } }) {
	let chatbot: z.infer<typeof ChatbotFlowSchema>;

	if (params.chatbot_id === 'new') {
		chatbot = CHATBOT_DEFAULT_VALUE;
	} else {
		try {
			chatbot = await ChatbotFlowService.findById(params.chatbot_id);
			if (!chatbot) {
				return notFound();
			}
		} catch (err) {
			return notFound();
		}
	}

	return <ChatbotFlowForm defaultValues={chatbot} isEditing={chatbot.id !== ''} />;
}
