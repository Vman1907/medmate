'use client';

import Each from '@/components/containers/each';
import { useChatbotFlow } from '@/components/context/chat-bot';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
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
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useRef, useState } from 'react';

export default function RestrictionRuleDialog({
	children,
	onConfirm,
	selectedBots,
}: {
	selectedBots: string[];
	children: React.ReactNode;
	onConfirm: (
		restrictionType: string,
		selectedRestrictionBot: {
			id: string;
			name: string;
		}[]
	) => void;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const list = useChatbotFlow();

	const [selectedRestrictionBot, setSelectedRestrictionBot] = useState<
		{
			name: string;
			id: string;
		}[]
	>([]);
	const [restrictionType, setRestrictionType] = useState<string>('');

	const addSelectedBot = (id: string) => {
		setSelectedRestrictionBot([
			...selectedRestrictionBot,
			{
				id,
				name: list.find((bot) => bot.id === id)?.name || '',
			},
		]);
	};

	const removeSelectedBot = (id: string) => {
		setSelectedRestrictionBot(selectedRestrictionBot.filter((selectedId) => selectedId.id !== id));
	};

	const handleSave = () => {
		onConfirm(restrictionType, selectedRestrictionBot);
		buttonRef.current?.click();
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					setSelectedRestrictionBot([]);
					setRestrictionType('');
				}
			}}
		>
			<DialogTrigger ref={buttonRef} asChild>
				{children}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w3-xl lg:max-w-5xl'>
				<DialogHeader>
					<DialogTitle className='flex justify-between'>Select Restrictions</DialogTitle>
				</DialogHeader>
				<Select value={restrictionType} onValueChange={setRestrictionType}>
					<SelectTrigger>
						<SelectValue placeholder='Select ' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='TRIGGER_KEYWORD'>Trigger Keyword</SelectItem>
						<SelectItem value='FLOW_TRIGGERED'>Chatbot Triggered</SelectItem>
					</SelectContent>
				</Select>
				<ScrollArea className='gap-4 h-[400px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell className='w-[5%]'>S.No.</TableCell>
								<TableCell>File Name</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							<Each
								items={list}
								render={(bot) => {
									if (selectedBots.includes(bot.id)) return <></>;
									return (
										<TableRow>
											<TableCell>
												<Checkbox
													checked={
														selectedRestrictionBot.findIndex(
															(selected) => selected.id === bot.id
														) !== -1
													}
													onCheckedChange={(checked) => {
														if (checked) {
															addSelectedBot(bot.id);
														} else {
															removeSelectedBot(bot.id);
														}
													}}
												/>
											</TableCell>
											<TableCell>{bot.name}</TableCell>
										</TableRow>
									);
								}}
							/>
						</TableBody>
					</Table>
				</ScrollArea>
				<DialogFooter>
					<Button
						disabled={selectedRestrictionBot.length === 0 || restrictionType === ''}
						type='submit'
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={handleSave}
					>
						Select
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
