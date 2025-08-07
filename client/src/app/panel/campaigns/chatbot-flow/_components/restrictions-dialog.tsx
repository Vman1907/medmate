import Show from '@/components/containers/show';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ChatbotFlowSchema } from '@/schema/chatbot-flow';
import { Trash } from 'lucide-react';
import { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import RestrictionRuleDialog from './restriction-rule-dialog';

export default function RestrictionDialog({
	children,
	restrictions,
	form,
}: {
	children: React.ReactNode;
	restrictions: {
		chatbot_flow_name: string;
		condition: 'TRIGGER_KEYWORD' | 'FLOW_TRIGGERED';
		chatbot_flow_id: string;
	}[];
	form: UseFormReturn<z.infer<typeof ChatbotFlowSchema>>;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	return (
		<Dialog>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w3-xl lg:max-w-6xl'>
				<AlertDialogHeader>
					<DialogTitle className='flex justify-between'>Select Restrictions</DialogTitle>
				</AlertDialogHeader>
				<div>
					<ScrollArea className='h-[450px] w-full rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Condition</TableHead>
									<TableHead className='text-center'>Delete</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<Show.ShowIf condition={restrictions.length === 0}>
									<TableRow>
										<TableCell colSpan={3} className='text-center'>
											No restrictions added
										</TableCell>
									</TableRow>
								</Show.ShowIf>
								{restrictions.map((restriction, index) => (
									<TableRow key={index}>
										<TableCell className='font-medium'>{restriction.chatbot_flow_name}</TableCell>
										<TableCell>
											<Select
												value={restriction.condition}
												onValueChange={(value) => {
													form.setValue(
														`restrictIf.${index}.condition`,
														value as 'TRIGGER_KEYWORD' | 'FLOW_TRIGGERED'
													);
												}}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='TRIGGER_KEYWORD'>Trigger Keyword</SelectItem>
													<SelectItem value='FLOW_TRIGGERED'>Chatbot Triggered</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell className='text-center'>
											<Button
												size={'sm'}
                                                className='p-1'
												variant={'destructive'}
												onClick={() =>
													form.setValue(
														'restrictIf',
														restrictions.filter((_, i) => i !== index)
													)
												}
											>
												<Trash />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
				</div>
				<DialogFooter>
					<RestrictionRuleDialog
						selectedBots={restrictions.map((restriction) => restriction.chatbot_flow_id)}
						onConfirm={(type, bots) =>
							form.setValue('restrictIf', [
								...restrictions,
								...Array.from({ length: bots.length }).map((_, i) => ({
									chatbot_flow_id: bots[i].id,
									condition: type as 'TRIGGER_KEYWORD' | 'FLOW_TRIGGERED',
									chatbot_flow_name: bots[i].name,
								})),
							])
						}
					>
						<Button variant={'outline'}>Add Rule</Button>
					</RestrictionRuleDialog>
					<DialogClose>
						<Button>Save</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
