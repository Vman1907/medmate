'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import { useTemplates } from '@/components/context/templates';
import ContactSelectorDialog from '@/components/elements/dialogs/contact-selector';
import DeleteDialog from '@/components/elements/dialogs/delete';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import NumberInputDialog from '@/components/elements/dialogs/numberInput';
import TemplateDialog, {
	TemplateMessageProps,
} from '@/components/elements/dialogs/template-data-selector';
import TagsSelector from '@/components/elements/popover/tags';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChatbotFlow, ChatbotFlowSchema } from '@/schema/chatbot-flow';
import { ContactWithID } from '@/schema/phonebook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cross1Icon } from '@radix-ui/react-icons';
import { ChevronLeftIcon, Info, Plus, TrashIcon } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import RestrictionDialog from '../_components/restrictions-dialog';
import { createChatbotFlow, editChatbotFlow } from '../action';

const tagsVariable = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
	'{{trigger}}',
];

export default function ChatbotFlowForm({
	defaultValues,
	isEditing,
}: {
	defaultValues: z.infer<typeof ChatbotFlowSchema>;
	isEditing: boolean;
}) {
	const messageRef = useRef(0);
	const forwardMessageRef = useRef(0);
	const router = useRouter();
	const params = useParams();
	const templates = useTemplates();
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');
	const [trigger, setTrigger] = useState<string>('');

	const form = useForm<z.infer<typeof ChatbotFlowSchema>>({
		resolver: zodResolver(ChatbotFlowSchema),
		mode: 'onChange',
		defaultValues: defaultValues,
	});

	const triggers = form.watch('trigger');
	const nurturing = form.watch('nurturing');
	const forward = form.watch('forward');
	const recipient = form.watch('recipient');
	const restrictions = form.watch('restrictIf');
	const selectedTemplate = form.watch('forward.template_id');

	const selectedTemplateButtons = (
		templates.find((template) => template.id === selectedTemplate)?.buttons ?? []
	).filter((button) => button.type === 'QUICK_REPLY');

	const handleSubmit = (data: z.infer<typeof ChatbotFlowSchema>) => {
		for (let i = 0; i < data.nurturing.length; i++) {
			if (data.nurturing[i].respond_type === 'normal') {
				if (
					Number(data.nurturing[i].after.value) *
						(data.nurturing[i].after.type === 'sec'
							? 1
							: data.nurturing[i].after.type === 'min'
							? 60
							: data.nurturing[i].after.type === 'hours'
							? 3600
							: 86400) >
					86400
				) {
					toast.error('Normal message cannot be sent after more than 24 hours');
					return;
				}
			}
		}
		const details = {
			...data,
			trigger: trigger ? [...data.trigger, trigger] : data.trigger,
			nurturing: data.nurturing.map((nurturing) => {
				if (nurturing.template_header?.type === 'NONE') {
					delete nurturing.template_header;
				}
				return {
					...nurturing,
					after:
						Number(nurturing.after.value) *
						(nurturing.after.type === 'sec'
							? 1
							: nurturing.after.type === 'min'
							? 60
							: nurturing.after.type === 'hours'
							? 3600
							: 86400),
				};
			}),
			trigger_gap_seconds:
				Number(data.trigger_gap_time) *
				(data.trigger_gap_type === 'SEC'
					? 1
					: data.trigger_gap_type === 'MINUTE'
					? 60
					: data.trigger_gap_type === 'HOUR'
					? 3600
					: 86400),
		};
		const promise = isEditing ? editChatbotFlow(data.id, details) : createChatbotFlow(details);
		toast.promise(promise, {
			loading: 'Saving...',
			success: (res) => {
				router.replace(`/panel/campaigns/chatbot-flow/${res}/customize`);
				return 'Saved';
			},
			error: (err) => {
				return 'Failed to save';
			},
		});
	};

	const insertVariablesToMessage = (index: number, variable: string) => {
		form.setValue(
			`nurturing.${index}.message`,
			form.getValues().nurturing[index].message.slice(0, messageRef.current) +
				variable +
				form.getValues().nurturing[index].message.slice(messageRef.current)
		);
	};

	const insertVariablesToForward = (variable: string) => {
		const message = form.getValues('forward.message');
		form.setValue(
			`forward.message`,
			message.slice(0, forwardMessageRef.current) +
				variable +
				message.slice(forwardMessageRef.current)
		);
	};

	const handleTemplateChange = (index: number, details: TemplateMessageProps) => {
		if (!details) return;
		form.setValue(`nurturing.${index}.template_name`, details.template_name);
		form.setValue(`nurturing.${index}.template_id`, details.template_id);
		form.setValue(
			`nurturing.${index}.template_body`,
			details.body as {
				custom_text: string;
				phonebook_data?: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value?: string;
			}[]
		);
		form.setValue(
			`nurturing.${index}.template_header`,
			details.header as {
				type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'NONE';
				text?: {
					custom_text: string;
					phonebook_data?: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value?: string;
				}[];
				media_id?: string;
				link?: string;
			}
		);
		form.setValue(`nurturing.${index}.template_buttons`, details.buttons);
		form.setValue(
			`nurturing.${index}.template_carousel`,
			details.carousel as {
				cards: {
					header: {
						media_id: string;
					};
					body: {
						custom_text: string;
						phonebook_data?: string;
						variable_from: 'custom_text' | 'phonebook_data';
						fallback_value?: string;
					}[];
					buttons: string[][];
				}[];
			}
		);
	};

	const handleTemplateForwardChange = (details: TemplateMessageProps) => {
		if (!details) return;
		form.setValue(`forward.template_name`, details.template_name);
		form.setValue(`forward.template_id`, details.template_id);
		form.setValue(`forward.template_body`, details.body);
		form.setValue(`forward.template_header`, details.header);
		form.setValue(`forward.template_buttons`, details.buttons);
		form.setValue(`forward.template_carousel`, details.carousel);
		form.setValue('forward.share_contact_card.button_text', '');
	};

	const addEmptyNurturing = () => {
		form.setValue('nurturing', [
			...form.getValues().nurturing,
			{
				after: {
					type: 'min',
					value: '1',
				},
				respond_type: 'normal',
				message: '',
				images: [],
				videos: [],
				audios: [],
				documents: [],
				contacts: [],
				template_id: '',
				template_name: '',
				template_header: {
					type: 'NONE',
					text: [],
					media_id: '',
					link: '',
				},
				template_body: [],
				template_buttons: [],
				template_carousel: {
					cards: [],
				},
			},
		]);
	};

	if (params.chatbot_id !== 'new' && !isEditing) {
		return notFound();
	}

	const deleteNurturing = (index: number) => {
		const newNurturing = [...nurturing];
		newNurturing.splice(index, 1);
		form.setValue('nurturing', newNurturing);
		return;
	};

	const handleTriggerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;

		if (value.includes('\n')) {
			e.preventDefault(); // Prevent default enter action
			const trimmedValue = value.trim(); // Remove whitespace

			if (trimmedValue) {
				form.setValue('trigger', [...triggers, trimmedValue]);
			}

			setTrigger('');
		} else {
			setTrigger(value);
		}
	};

	const isValid = ChatbotFlowSchema.safeParse(form.getValues()).success;

	return (
		<div className='custom-scrollbar flex flex-col gap-2 justify-center p-4'>
			{/*--------------------------------- TRIGGER SECTION--------------------------- */}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className='flex flex-col rounded-xl mb-4 gap-8'
				>
					<div className='flex flex-col gap-2'>
						<Button
							type='button'
							className='self-start'
							variant={'link'}
							onClick={() => router.back()}
						>
							<ChevronLeftIcon className='w-6 h-6' />
						</Button>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>
										Name<span className='ml-[0.2rem] text-red-800'>*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder='eg. Fanfest' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-between items-center'>
							<p>Trigger</p>
							<div className='flex gap-2 items-center'>
								<Show.ShowIf condition={triggers.length === 0}>
									<div>
										<RestrictionDialog form={form} restrictions={restrictions}>
											<Button variant={'secondary'} className='flex-1'>
												Add Restriction Rule
											</Button>
										</RestrictionDialog>
									</div>
								</Show.ShowIf>
								<FormField
									control={form.control}
									name='trigger'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 inline-flex items-center gap-2'>
											<FormControl>
												<Checkbox
													checked={field.value.length === 0}
													onCheckedChange={(checked) => checked && field.onChange([])}
												/>
											</FormControl>
											<div className='text-sm'>Default Message</div>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<FormItem className='space-y-0 flex-1'>
							<div className='flex gap-2'>
								<FormControl>
									<Textarea
										placeholder='eg. Fanfest'
										value={trigger}
										onChange={handleTriggerChange}
									/>
								</FormControl>
							</div>
							<p className='text-sm '>Press enter to add the new trigger</p>
							<div className='flex flex-wrap gap-2 p-2'>
								<Each
									items={triggers}
									render={(items, index) => (
										<Badge className='inline-flex gap-2 items-center' key={index}>
											{items}
											<Cross1Icon
												className='cursor-pointer'
												onClick={() => {
													form.setValue(
														'trigger',
														form.getValues().trigger.filter((_, i) => i !== index)
													);
												}}
											/>
										</Badge>
									)}
								/>
							</div>
							<FormMessage />
						</FormItem>
					</div>

					{/*--------------------------------- RECIPIENTS SECTION--------------------------- */}

					<div className='gap-2 flex flex-col'>
						<div>
							<p>Recipient</p>
						</div>

						<div className='flex gap-2'>
							<NumberInputDialog
								onSubmit={(value) => form.setValue('recipient.include', value)}
								defaultValue={recipient.include}
							>
								<Button variant={'secondary'} className='flex-1'>
									<Plus className='w-4 h-4' />
									<span>Include ({recipient.include.length})</span>
								</Button>
							</NumberInputDialog>
							<NumberInputDialog
								onSubmit={(value) => form.setValue('recipient.exclude', value)}
								defaultValue={recipient.exclude}
							>
								<Button variant={'secondary'} className='flex-1'>
									<Plus className='w-4 h-4' />
									<span>Exclude ({recipient.exclude.length})</span>
								</Button>
							</NumberInputDialog>
							<TagsSelector
								selected={recipient.allowed_labels}
								onChange={(value) => form.setValue('recipient.allowed_labels', value)}
							>
								<Button variant={'secondary'} className='flex-1'>
									<Plus className='w-4 h-4' />
									<span>Allowed Labels ({recipient.allowed_labels.length})</span>
								</Button>
							</TagsSelector>
							<TagsSelector
								selected={recipient.allowed_labels}
								onChange={(value) => form.setValue('recipient.restricted_labels', value)}
							>
								<Button variant={'secondary'} className='flex-1'>
									<Plus className='w-4 h-4' />
									<span>Restricted Labels ({recipient.restricted_labels.length})</span>
								</Button>
							</TagsSelector>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='options'
							render={({ field }) => (
								<FormItem className='space-y-0 flex-1'>
									<FormLabel>
										Conditions<span className='ml-[0.2rem] text-red-800'>*</span>
									</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='INCLUDES_IGNORE_CASE'>Includes Ignore Case</SelectItem>
												<SelectItem value='INCLUDES_MATCH_CASE'>Includes Match Case</SelectItem>
												<SelectItem value='EXACT_IGNORE_CASE'>Exact Ignore Case</SelectItem>
												<SelectItem value='EXACT_MATCH_CASE'>Exact Match Case</SelectItem>
												<SelectItem value='ANYWHERE_MATCH_CASE'>Anywhere Match Case</SelectItem>
												<SelectItem value='ANYWHERE_IGNORE_CASE'>Anywhere Ignore Case</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex flex-col md:flex-row gap-4'>
							<div className='flex flex-col md:flex-row gap-4 flex-1'>
								<div className='flex flex-col gap-2'>
									<div className='grid grid-cols-2 gap-2 items-end'>
										<FormField
											control={form.control}
											name='trigger_gap_time'
											render={({ field }) => (
												<FormItem className='space-y-0 flex-1 max-w-md'>
													<FormLabel className='inline-flex items-center'>
														Gap Delay
														<Tooltip>
															<TooltipTrigger>
																<Info className='w-3 h-3 ml-2' />
															</TooltipTrigger>
															<TooltipContent>
																<p>Time Gap if same trigger is sent.</p>
															</TooltipContent>
														</Tooltip>
													</FormLabel>
													<FormControl>
														<Input type='number' placeholder='eg. 10' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='trigger_gap_type'
											render={({ field }) => (
												<FormItem className='space-y-0 flex-1 max-w-md'>
													<FormControl>
														<Select value={field.value} onValueChange={field.onChange}>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value='SEC'>Second</SelectItem>
																<SelectItem value='MINUTE'>Min</SelectItem>
																<SelectItem value='HOUR'>Hour</SelectItem>
																<SelectItem value='DAY'>Day</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>
							<div className='flex flex-col md:flex-row gap-4 flex-1'>
								<FormField
									control={form.control}
									name='startAt'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 max-w-md'>
											<FormLabel>Start At (in IST)</FormLabel>
											<FormControl>
												<Input type='time' value={field.value} onChange={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='endAt'
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 max-w-md'>
											<FormLabel>End At (in IST)</FormLabel>
											<FormControl>
												<Input type='time' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					{/* -------------------------------- FORWARD SECTION -------------------------- */}

					<div className='flex flex-col gap-2 mt-4'>
						<div className='relative'>
							<Separator />
						</div>
						<div className='border-2 rounded-lg p-4 bg-gray-100'>
							<div className='text-center text-xl'>Forward Leads</div>
							<div className='flex-1 mt-2 '>
								<FormField
									name='forward.number'
									control={form.control}
									render={({ field }) => (
										<FormItem className='space-y-0 flex-1 flex-col flex gap-2'>
											<FormLabel>Forward To (without +)</FormLabel>
											<FormControl>
												<NumberInputDialog
													onSubmit={(numbers) => {
														field.onChange(numbers);
													}}
													defaultValue={field.value ?? []}
												>
													<Button variant={'outline'} className='flex-1'>
														{field.value.length === 0
															? 'Add Numbers'
															: `Numbers (${field.value.length})`}
													</Button>
												</NumberInputDialog>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Label>Forward Message</Label>
							<FormField
								name='forward'
								control={form.control}
								render={({ field }) => (
									<Tabs
										defaultValue='normal'
										onValueChange={(value) =>
											form.setValue(
												`forward.respond_type`,
												value as ChatbotFlow['forward']['respond_type']
											)
										}
										value={field.value.respond_type}
									>
										<TabsList>
											<TabsTrigger value='normal'>Normal Message</TabsTrigger>
											<TabsTrigger value='template'>Template Message</TabsTrigger>
										</TabsList>
										<TabsContent value='normal'>
											<p>Medias</p>

											<div className='flex flex-wrap justify-stretch gap-4 my-4 w-full'>
												<ContactSelectorDialog
													onConfirm={(values: ContactWithID[]) =>
														form.setValue(
															`forward.contacts`,
															values.map((contact) => contact.id)
														)
													}
												>
													<Button variant={'outline'} className='flex-1 min-w-[200px]'>
														Contacts ({field.value.contacts?.length ?? 0})
													</Button>
												</ContactSelectorDialog>
												<MediaSelectorDialog
													type='audio'
													onConfirm={(id) => form.setValue(`forward.audios`, id)}
													selectedValue={field.value.audios}
												>
													<Button variant={'outline'} className='flex-1 min-w-[200px]'>
														Audio ({field.value.audios?.length ?? 0})
													</Button>
												</MediaSelectorDialog>
												<MediaSelectorDialog
													type='document'
													onConfirm={(id) => form.setValue(`forward.documents`, id)}
													selectedValue={field.value.documents}
												>
													<Button variant={'outline'} className='flex-1 min-w-[200px]'>
														Document ({field.value.documents?.length ?? 0})
													</Button>
												</MediaSelectorDialog>
												<MediaSelectorDialog
													type='image'
													onConfirm={(id) => form.setValue(`forward.images`, id)}
													selectedValue={field.value.images}
												>
													<Button variant={'outline'} className='flex-1 min-w-[200px]'>
														Image ({field.value.images?.length ?? 0})
													</Button>
												</MediaSelectorDialog>
												<MediaSelectorDialog
													type='video'
													onConfirm={(id) => form.setValue(`forward.videos`, id)}
													selectedValue={field.value.videos}
												>
													<Button variant={'outline'} className='flex-1 min-w-[200px]'>
														Video ({field.value.videos?.length ?? 0})
													</Button>
												</MediaSelectorDialog>
											</div>
											<FormField
												control={form.control}
												name={`forward.message`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1'>
														<FormControl>
															<Textarea
																className='min-h-[80px] resize-none'
																placeholder={
																	'Type your message here. \nex. You are invited to join fanfest'
																}
																{...field}
																onMouseUp={(
																	e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>
																) => {
																	if (e.target instanceof HTMLTextAreaElement) {
																		forwardMessageRef.current = e.target.selectionStart;
																	}
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div className='flex flex-wrap gap-4 mt-4'>
												<Each
													items={tagsVariable}
													render={(tag) => (
														<Badge
															className='cursor-pointer'
															onClick={() => insertVariablesToForward(tag)}
														>
															{tag}
														</Badge>
													)}
												/>
											</div>
										</TabsContent>
										<TabsContent value='template'>
											<p>Template</p>
											<FormField
												control={form.control}
												name={`forward.template_name`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1'>
														<FormControl>
															<TemplateDialog
																expect_trigger
																expect_forward_data
																expect_message
																template={{
																	template_id: forward.template_id,
																	template_name: field.value,
																	body: forward.template_body,
																	header: forward.template_header,
																	buttons: forward.template_buttons,
																	carousel: forward.template_carousel,
																}}
																onConfirm={(value) => handleTemplateForwardChange(value)}
															>
																<Button>{field.value ? field.value : 'Select template'}</Button>
															</TemplateDialog>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<Separator className='my-4' />
											<Show.ShowIf condition={(selectedTemplateButtons?.length ?? 0) > 0}>
												<div className='flex items-center'>
													<FormField
														control={form.control}
														name={`forward.share_contact_card.enabled`}
														render={({ field }) => (
															<Checkbox
																className='mr-2'
																checked={field.value}
																onCheckedChange={(e) => field.onChange(e.valueOf() as boolean)}
															/>
														)}
													/>
													<FormLabel>Forward Contact Card To</FormLabel>
													<Show>
														<Show.When condition={form.watch('forward.share_contact_card.enabled')}>
															<FormField
																control={form.control}
																name={`forward.share_contact_card.button_text`}
																render={({ field }) => (
																	<FormItem className='ml-2'>
																		<Select value={field.value} onValueChange={field.onChange}>
																			<SelectTrigger>
																				<SelectValue placeholder='Select Button' />
																				<SelectContent>
																					<Each
																						items={selectedTemplateButtons ?? []}
																						render={(button) => (
																							<SelectItem value={button.text}>
																								{button.text}
																							</SelectItem>
																						)}
																					/>
																				</SelectContent>
																			</SelectTrigger>
																		</Select>
																	</FormItem>
																)}
															/>
														</Show.When>
														<Show.Else>
															<FormLabel className='ml-1'>None</FormLabel>
														</Show.Else>
													</Show>
												</div>
											</Show.ShowIf>
										</TabsContent>
									</Tabs>
								)}
							/>
						</div>
					</div>

					{/*--------------------------------- NURTURING SECTION--------------------------- */}

					<div>
						<div className='flex justify-between items-center'>
							<p>Nurturing</p>
							<div className='flex gap-2 items-center'>
								<Button type='button' size={'sm'} onClick={addEmptyNurturing}>
									<Plus className='w-4 h-4' />
									<span>Add Nurturing</span>
								</Button>
							</div>
						</div>
						<Accordion type='single' collapsible>
							<Each
								items={nurturing}
								render={(item, index) => (
									<AccordionItem value={index.toString()}>
										<AccordionTrigger>Nurturing {index + 1}</AccordionTrigger>
										<Separator className='mb-4' />
										<AccordionContent>
											<div className='flex justify-between'>
												<div className='flex gap-2 items-center my-2'>
													<p>Send this message after</p>
													<div className='flex gap-2'>
														<FormField
															control={form.control}
															name={`nurturing.${index}.after.type`}
															render={({ field }) => (
																<FormItem className='space-y-0 flex-1'>
																	<FormControl>
																		<Select value={field.value} onValueChange={field.onChange}>
																			<SelectTrigger>
																				<SelectValue />
																			</SelectTrigger>
																			<SelectContent>
																				<SelectItem value='sec'>Seconds</SelectItem>
																				<SelectItem value='min'>Minutes</SelectItem>
																				<SelectItem value='hours'>Hours</SelectItem>
																				<SelectItem value='days'>Days</SelectItem>
																			</SelectContent>
																		</Select>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`nurturing.${index}.after.value`}
															render={({ field }) => (
																<FormItem className='space-y-0 flex-1'>
																	<FormControl>
																		<Input type='number' {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
												</div>
												<Button
													variant={'destructive'}
													size={'icon'}
													onClick={() => deleteNurturing(index)}
												>
													<TrashIcon className='w-6 h-6' />
												</Button>
											</div>
											<Tabs
												defaultValue='normal'
												onValueChange={(value) =>
													form.setValue(
														`nurturing.${index}.respond_type`,
														value as ChatbotFlow['nurturing'][0]['respond_type']
													)
												}
												value={nurturing[index].respond_type}
											>
												<TabsList>
													<TabsTrigger value='normal'>Normal Message</TabsTrigger>
													<TabsTrigger value='template'>Template Message</TabsTrigger>
												</TabsList>
												<TabsContent value='normal'>
													<p>Medias</p>

													<div className='flex flex-wrap justify-stretch gap-4 my-4 w-full'>
														<ContactSelectorDialog
															onConfirm={(values: ContactWithID[]) =>
																form.setValue(
																	`nurturing.${index}.contacts`,
																	values.map((contact) => contact.id)
																)
															}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																VCards ({nurturing[index].contacts.length})
															</Button>
														</ContactSelectorDialog>
														<MediaSelectorDialog
															type='audio'
															onConfirm={(id) => form.setValue(`nurturing.${index}.audios`, id)}
															selectedValue={nurturing[index].audios}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Audio ({nurturing[index].audios.length})
															</Button>
														</MediaSelectorDialog>
														<MediaSelectorDialog
															type='document'
															onConfirm={(id) => form.setValue(`nurturing.${index}.documents`, id)}
															selectedValue={nurturing[index].documents}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Document ({nurturing[index].documents.length})
															</Button>
														</MediaSelectorDialog>
														<MediaSelectorDialog
															type='image'
															onConfirm={(id) => form.setValue(`nurturing.${index}.images`, id)}
															selectedValue={nurturing[index].images}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Image ({nurturing[index].images.length})
															</Button>
														</MediaSelectorDialog>
														<MediaSelectorDialog
															type='video'
															onConfirm={(id) => form.setValue(`nurturing.${index}.videos`, id)}
															selectedValue={nurturing[index].videos}
														>
															<Button variant={'outline'} className='flex-1 min-w-[200px]'>
																Video ({nurturing[index].videos.length})
															</Button>
														</MediaSelectorDialog>
													</div>
													<FormField
														control={form.control}
														name={`nurturing.${index}.message`}
														render={({ field }) => (
															<FormItem className='space-y-0 flex-1'>
																<FormControl>
																	<Textarea
																		className='min-h-[80px] resize-none'
																		placeholder={
																			'Type your message here. \nex. You are invited to join fanfest'
																		}
																		{...field}
																		onMouseUp={(
																			e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>
																		) => {
																			if (e.target instanceof HTMLTextAreaElement) {
																				messageRef.current = e.target.selectionStart;
																			}
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className='flex flex-wrap gap-4 mt-4'>
														<Each
															items={tagsVariable}
															render={(tag) => (
																<Badge
																	className='cursor-pointer'
																	onClick={() => insertVariablesToMessage(index, tag)}
																>
																	{tag}
																</Badge>
															)}
														/>
													</div>
												</TabsContent>
												<TabsContent value='template'>
													<p>Template</p>
													<FormField
														control={form.control}
														name={`nurturing.${index}.template_name`}
														render={({ field }) => (
															<FormItem className='space-y-0 flex-1'>
																<FormControl>
																	<TemplateDialog
																		template={{
																			template_id: nurturing[index].template_id,
																			template_name: field.value,
																			body: nurturing[index].template_body,
																			header: nurturing[index].template_header,
																			buttons: nurturing[index].template_buttons,
																			carousel: nurturing[index].template_carousel,
																		}}
																		onConfirm={(value) => handleTemplateChange(index, value)}
																	>
																		<Button>{field.value ? field.value : 'Select template'}</Button>
																	</TemplateDialog>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<Separator className='my-4' />
												</TabsContent>
											</Tabs>
										</AccordionContent>
									</AccordionItem>
								)}
							/>
						</Accordion>
					</div>

					<div className='flex gap-4'>
						<Show.ShowIf condition={isEditing}>
							<Button
								className='flex-1'
								variant={'outline'}
								type='button'
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</Show.ShowIf>
						<Show>
							<Show.When condition={nurturing.length > 0}>
								<DeleteDialog
									title='Warning!'
									primaryButton
									actionButtonText='Continue'
									message='You have nurturing in your flow, please add a start node in customization.'
									onDelete={() => {
										handleSubmit(form.getValues());
									}}
								>
									<Button className='flex-1' type='button' disabled={!isValid}>
										Save
									</Button>
								</DeleteDialog>
							</Show.When>
							<Show.Else>
								<Button className='flex-1' type='submit' disabled={!isValid}>
									Save
								</Button>
							</Show.Else>
						</Show>
					</div>
				</form>
			</Form>
		</div>
	);
}
