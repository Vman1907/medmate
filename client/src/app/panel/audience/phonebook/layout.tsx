import { AgentProvider } from '@/components/context/agents';
import Loading from '@/components/elements/loading';
import AgentService from '@/services/agent.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Phonebook • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const agents = await AgentService.getAgents();
	return (
		<Suspense fallback={<Loading />}>
			<AgentProvider data={agents}>{children}</AgentProvider>
		</Suspense>
	);
}
