import { AgentProvider } from '@/components/context/agents';
import { ChatListExpandedProvider } from '@/components/context/chat-list-expanded';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { MessagesProvider } from '@/components/context/message-store-provider';
import { QuickReplyProvider } from '@/components/context/quick-replies';
import { TemplatesProvider } from '@/components/context/templates';
import { WhatsappFlowProvider } from '@/components/context/whatsappFlows';
import AgentService from '@/services/agent.service';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import MessagesService from '@/services/messages.service';
import TemplateService from '@/services/template.service';
import WhatsappFlowService from '@/services/whatsapp-flow.service';

const DataProvider = async ({ children }: { children: React.ReactNode }) => {
	const [quickReplies, media, contacts, template, flow, agents] = await Promise.all([
		MessagesService.fetchQuickReplies(),
		MediaService.getMedias(),
		ContactService.listContacts(),
		TemplateService.listTemplates(),
		WhatsappFlowService.listWhatsappFlows(),
		AgentService.getAgents(),
	]);
	return (
		<AgentProvider data={agents}>
			<MediaProvider data={media}>
				<WhatsappFlowProvider data={flow as any}>
					<TemplatesProvider data={template}>
						<ContactsProvider data={contacts}>
							<QuickReplyProvider data={quickReplies}>
								<MessagesProvider>
									<ChatListExpandedProvider>{children}</ChatListExpandedProvider>
								</MessagesProvider>
							</QuickReplyProvider>
						</ContactsProvider>
					</TemplatesProvider>
				</WhatsappFlowProvider>
			</MediaProvider>
		</AgentProvider>
	);
};

export default DataProvider;
