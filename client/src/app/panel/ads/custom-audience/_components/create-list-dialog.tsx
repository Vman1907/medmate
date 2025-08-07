'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { FileUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import DownloadSampleButton from './download-sample-button';

const CreateNewListDialog = () => {
	const router = useRouter();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [selectedFile, setFile] = useState<{
		file: File;
		size: string;
		url: string;
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		const fileSizeBytes = file.size;

		const url = window.URL.createObjectURL(file);

		const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
		const fileSizeMB = fileSizeKB / 1024;

		setFile({
			file,
			size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
			url,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	async function submit() {
		if (!selectedFile) return;

		toast.promise(
			AdCampaignService.createNewCustomAudienceList(selectedFile.file, name, description),
			{
				success: () => {
					router.refresh();
					return 'Created new audience group successfully.';
				},
				error: 'Failed to create group.',
				loading: 'Creating new audience group...',
			}
		);
	}

	const removeSelectedFile = () => {
		setFile(null);
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setName('');
					setFile(null);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
					<FileUp className='w-4 h-4 mr-2' />
					Create New List
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>New Audience Group</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						{selectedFile ? (
							<div className='w-full gap-2 flex flex-col'>
								<p>Selected file : {selectedFile.file.name}</p>
								<div className='flex justify-between items-center'>
									<p>Selected file size : {selectedFile.size}</p>
								</div>
								<Button
									variant={'link'}
									onClick={removeSelectedFile}
									className='cursor-pointer font-normal text-red-400 w-fit p-0'
								>
									Remove
								</Button>
							</div>
						) : (
							<Label
								htmlFor='logo'
								className={
									'!cursor-pointer text-center border border-gray-400 border-dashed py-12 rounded-lg text-normal text-primary'
								}
							>
								<>
									Drag and drop file here, or click to select file
									<span className='ml-[0.2rem] text-red-800'>*</span>
								</>
							</Label>
						)}
						<Input
							id='logo'
							className='hidden'
							type='file'
							ref={fileInputRef}
							onChange={handleFileChange}
							//only excel file and csv file
							accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Name<span className='ml-[0.2rem] text-red-800'>*</span>
						</Label>
						<Input
							id='name'
							value={name}
							placeholder='eg. List of customers'
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='text-primary' htmlFor='name'>
							Description
						</Label>
						<Textarea
							id='name'
							value={description}
							placeholder='eg. Facebook users'
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter className='mt-2 w-full'>
					<div className='flex-1'>
						<DownloadSampleButton />
					</div>
					<div className='flex justify-end gap-4'>
						<DialogClose asChild>
							<Button variant='secondary'>Cancel</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button disabled={!name.trim() || !selectedFile} onClick={submit}>
								Save
							</Button>
						</DialogClose>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateNewListDialog;
