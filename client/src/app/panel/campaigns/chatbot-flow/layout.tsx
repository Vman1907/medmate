import { ChatBotProvider } from '@/components/context/chat-bot';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Chatbot Flow • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [medias, contacts, list, templateList] = await Promise.all([
		MediaService.getMedias(),
		ContactService.listContacts(),
		ChatbotFlowService.listChatBots(),
		TemplateService.listTemplates(),
	]);

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templateList}>
					<ContactsProvider data={contacts}>
						<MediaProvider data={medias}>
							<ChatBotProvider data={list}>{children}</ChatBotProvider>
						</MediaProvider>
					</ContactsProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
