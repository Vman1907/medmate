'use server';

import { permissionsSchema } from '@/schema/access';
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';
import { z } from 'zod';

export async function switchServiceAccount(id: string) {
	const status = await AuthService.serviceAccount(id);
	if (status !== undefined && status !== null) {
		redirect('/agent/home/dashboard', RedirectType.replace);
	}
}

export async function updateAgentPermission(id: string, data: z.infer<typeof permissionsSchema>) {
	await AgentService.assignAgentPermission(id, data);
}

export async function deleteAgent(id: string) {
	try {
		await AgentService.deleteAgent(id);
	} catch (e) {}
}

export async function assignConversationsToAgent(id: string, numbers: string[]) {
	await AgentService.assignConversationsToAgent(id, { numbers });
}
