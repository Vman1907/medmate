import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import WhatsappFlowService from '@/services/whatsapp-flow.service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import WhatsappFlowContextMenu from './_components/context-menus';
import { WhatsappFlowDialog } from './_components/dialogs';

export default async function WhatsappFlow({ params }: { params: { panel: string } }) {
	const list:
		| {
				id: string;
				name: string;
				status: 'DRAFT' | 'PUBLISHED';
				categories: (
					| 'SIGN_UP'
					| 'SIGN_IN'
					| 'APPOINTMENT_BOOKING'
					| 'LEAD_GENERATION'
					| 'CONTACT_US'
					| 'CUSTOMER_SUPPORT'
					| 'SURVEY'
					| 'OTHER'
				)[];
		  }[]
		| string = await WhatsappFlowService.listWhatsappFlows();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Whatsapp Flow</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Link href={`/panel/campaigns/whatsapp-flow?flow=create`}>
						<Button size={'sm'}>
							<Plus size={16} className='mr-2' />
							Create New
						</Button>
					</Link>
				</div>
			</div>
			<Show>
				<Show.When condition={typeof list == 'string'}>
					<div>You have not added any Device</div>
				</Show.When>
				<Show.Else>
					<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Categories</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-center'>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<Each
									items={
										(list as {
											id: string;
											name: string;
											status: 'DRAFT' | 'PUBLISHED';
											categories: (
												| 'SIGN_UP'
												| 'SIGN_IN'
												| 'APPOINTMENT_BOOKING'
												| 'LEAD_GENERATION'
												| 'CONTACT_US'
												| 'CUSTOMER_SUPPORT'
												| 'SURVEY'
												| 'OTHER'
											)[];
										}[]) ?? []
									}
									render={(item) => (
										<TableRow>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.categories.join(', ')}</TableCell>
											<TableCell>{item.status}</TableCell>
											<TableCell className='text-center'>
												<WhatsappFlowContextMenu
													id={item.id}
													details={{
														name: item.name,
														categories: item.categories,
														status: item.status,
													}}
												>
													<Button variant={'outline'} size={'sm'}>
														Actions
													</Button>
												</WhatsappFlowContextMenu>
											</TableCell>
										</TableRow>
									)}
								/>
							</TableBody>
						</Table>
					</div>
				</Show.Else>
			</Show>

			<WhatsappFlowDialog />
		</div>
	);
}
