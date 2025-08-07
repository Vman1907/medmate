import Each from '@/components/containers/each';
import ContactDialog from '@/components/elements/dialogs/contact';
import PreviewFile from '@/components/elements/preview-file';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import useBoolean from '@/hooks/useBoolean';
import api from '@/lib/api';
import { SERVER_URL } from '@/lib/consts';
import { cacheImageLocally, getCachedImage } from '@/lib/localDB';
import {
	downloadBlob,
	getFileSize,
	getFileType,
	getInitials,
	parseLinksToAnchorTags,
} from '@/lib/utils';
import { Contact } from '@/schema/phonebook';
import { Message as TMessage } from '@/types/recipient';
import { ArrowDownToLine, Loader2, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdOutlinePermMedia } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import ChatMessageWrapper from './message-wrapper';
import MessagesService from '@/services/messages.service';

type MessageProps = {
	message: TMessage;
};

const getMediaProxyUrl = (message: TMessage) => {
	if (message.header_content_source === 'ID') {
		return `${SERVER_URL}/conversation/${message._id}/media/${message.header_content}/proxy`;
	} else if (message.header_content_source === 'LINK') {
		return message.header_content;
	}
	return `${SERVER_URL}/conversation/${message._id}/media/${message.body?.media_id}/proxy`;
};

export const Message = memo(({ message }: MessageProps) => {
	if (message.body?.body_type === 'TEXT') {
		return <TextMessage message={message} />;
	}

	if (message.body?.body_type === 'LOCATION') {
		return <LocationMessage message={message} />;
	}

	if (message.body?.body_type === 'MEDIA') {
		return <MediaMessage message={message} />;
	}

	if (message.body?.body_type === 'CONTACT') {
		return <ContactMessage message={message} />;
	}

	if (message.body?.body_type === 'UNKNOWN') {
		return <UnknownMessage message={message} />;
	}
	return <></>;
});

Message.displayName = 'Message';

const TextMessage = ({ message }: { message: TMessage }) => {
	const mediaId = message.header_content_source === 'ID' ? message.header_content : '';

	const [mediaDownloadStatus, setMediaDownloadStatus] = useState<
		'pending' | 'downloading' | 'downloaded' | 'error'
	>('pending');
	const [metadata, setMetadata] = useState<{
		loaded: boolean;
		mimeType: string;
		size: number;
		isMetaUrl: boolean;
		url: string;
	}>({
		loaded: false,
		mimeType: '',
		size: 0,
		isMetaUrl: false,
		url: '',
	});

	const [previewSrc, setPreviewSrc] = useState('');
	const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

	useEffect(() => {
		const showHeader = !!message.header_content;
		const headerIsMedia =
			message.header_type === 'IMAGE' ||
			message.header_type === 'VIDEO' ||
			message.header_type === 'DOCUMENT';
		if (!showHeader || !headerIsMedia) {
			return;
		}
		if (!inView || metadata.loaded) return;

		getCachedImage(mediaId).then((cachedData) => {
			if (cachedData) {
				setPreviewSrc(cachedData);
				setMetadata({
					loaded: true,
					mimeType: 'image/jpeg',
					size: 0,
					isMetaUrl: false,
					url: '',
				});
				setMediaDownloadStatus('downloaded');
			} else {
				MessagesService.getMedia(message._id, mediaId).then((data) => {
					setMetadata({
						loaded: true,
						mimeType: data.mime_type,
						size: data.size,
						isMetaUrl: data.is_meta_url,
						url: data.url,
					});
				});
			}
		});
	}, [inView, message, mediaId, metadata.loaded]);

	const showHeader = !!message.header_content;
	const headerIsMedia =
		message.header_type === 'IMAGE' ||
		message.header_type === 'VIDEO' ||
		message.header_type === 'DOCUMENT';
	const headerIsText = message.header_type === 'TEXT';

	const handlePreview = useCallback(async () => {
		setMediaDownloadStatus('downloading');
		const url = !metadata.isMetaUrl ? metadata.url : getMediaProxyUrl(message);

		api
			.get(url, {
				responseType: 'blob',
			})
			.then(({ data: blob }) => {
				if (metadata.mimeType.includes('image')) {
					cacheImageLocally(mediaId, blob);
				}
				setPreviewSrc(window.URL.createObjectURL(blob));
				setMediaDownloadStatus('downloaded');
			})
			.catch(() => setMediaDownloadStatus('error'));
	}, [metadata, message, mediaId]);

	return (
		<ChatMessageWrapper message={message}>
			{showHeader ? (
				headerIsMedia ? (
					!metadata.loaded ? (
						<div className='w-full' ref={inViewRef}>
							<div className='flex justify-center items-center  w-[260px] aspect-video bg-gray-200 rounded-lg'>
								<MdOutlinePermMedia size={'2.5rem'} color='white' />
							</div>
						</div>
					) : mediaDownloadStatus === 'pending' ? (
						<div className='w-full relative'>
							<div className='flex justify-center items-center w-[16.25rem] aspect-video bg-gray-200 rounded-lg'>
								<MdOutlinePermMedia size={'2.5rem'} color='white' />
							</div>
							<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 opacity-80 w-fit-content px-4 h-10 rounded-full'>
								<div
									className='flex gap-2 cursor-pointer items-center justify-center h-full'
									onClick={handlePreview}
								>
									<ArrowDownToLine className='w-4 h-4 text-white' />
									<p className='text-white text-sm'>{getFileSize(metadata.size)}</p>
								</div>
							</div>
						</div>
					) : mediaDownloadStatus === 'downloading' ? (
						<div className='w-full relative'>
							<div className='flex justify-center items-center w-[16.25rem] aspect-video bg-gray-200 rounded-lg'>
								<MdOutlinePermMedia size={'2.5rem'} color='white' />
							</div>
							<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 opacity-80 w-fit-content px-3 h-10 rounded-full'>
								<div className='flex gap-2 cursor-pointer items-center justify-center h-full'>
									<Loader2 className='w-4 h-4 text-white animate-spin' />
								</div>
							</div>
						</div>
					) : (
						<div className='flex flex-col w-[400px] max-w-full aspect-square relative mx-auto'>
							<div className=' mx-auto h-[94%] aspect-square'>
								<PreviewFile
									data={{
										url: previewSrc,
										type: getFileType(metadata.mimeType),
									}}
								/>
							</div>
						</div>
					)
				) : headerIsText ? (
					<p className='font-bold'>{message.header_content}</p>
				) : null
			) : null}
			<p
				className='whitespace-pre-wrap break-all'
				dangerouslySetInnerHTML={{
					__html: parseLinksToAnchorTags(message.body?.text ?? ''),
				}}
			/>
			<p className='whitespace-pre-wrap text-sm text-gray-600'>{message.footer_content}</p>
		</ChatMessageWrapper>
	);
};

const LocationMessage = ({ message }: { message: TMessage }) => {
	return (
		<ChatMessageWrapper message={message}>
			<Link
				href={`https://www.google.com/maps/search/?q=${message.body?.location?.latitude ?? ''},${
					message.body?.location?.longitude ?? ''
				}`}
				target='_blank'
			>
				<p className='text-primary'>
					<ArrowDownToLine className='w-5 h-5 text-primary my-auto inline-block mr-1' />
					Location
				</p>
				{message.body?.location?.name ? (
					<p className='font-medium'>{message.body.location?.name}</p>
				) : null}
				{message.body?.location?.address ? <p>{message.body.location?.address}</p> : null}
				{!message.body?.location?.name && !message.body?.location?.address ? (
					<p>Open Location</p>
				) : null}
			</Link>
		</ChatMessageWrapper>
	);
};

const MediaMessage = ({ message }: { message: TMessage }) => {
	const mediaId = message.body?.media_id ?? '';

	const [mediaDownloadStatus, setMediaDownloadStatus] = useState<
		'pending' | 'downloading' | 'downloaded' | 'error'
	>('pending');
	const [metadata, setMetadata] = useState<{
		loaded: boolean;
		mimeType: string;
		size: number;
		isMetaUrl: boolean;
		url: string;
	}>({
		loaded: false,
		mimeType: '',
		size: 0,
		isMetaUrl: false,
		url: '',
	});
	const [previewSrc, setPreviewSrc] = useState('');

	const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
	useEffect(() => {
		if (!inView || metadata.loaded) return;

		getCachedImage(mediaId).then((cachedData) => {
			if (cachedData) {
				setPreviewSrc(cachedData);
				setMetadata({
					loaded: true,
					mimeType: 'image/jpeg',
					size: 0,
					isMetaUrl: false,
					url: '',
				});
				setMediaDownloadStatus('downloaded');
			} else {
				MessagesService.getMedia(message._id, mediaId).then((data) => {
					setMetadata({
						loaded: true,
						mimeType: data.mime_type,
						size: data.size,
						isMetaUrl: data.is_meta_url,
						url: data.url,
					});
				});
			}
		});
	}, [inView, mediaId, message._id, metadata.loaded]);

	const handleDownload = () => {
		const url = !metadata.isMetaUrl ? metadata.url : getMediaProxyUrl(message);

		toast.promise(
			api.get(url, {
				responseType: 'blob',
			}),
			{
				loading: 'Downloading...',
				success: ({ data: blob }) => {
					downloadBlob(blob, message._id, metadata.mimeType);
					return 'Downloaded!';
				},
				error: 'Failed to download',
			}
		);
	};
	const handlePreview = useCallback(async () => {
		setMediaDownloadStatus('downloading');
		const url = !metadata.isMetaUrl ? metadata.url : getMediaProxyUrl(message);

		api
			.get(url, {
				responseType: 'blob',
			})
			.then(({ data: blob }) => {
				if (metadata.mimeType.includes('image')) {
					cacheImageLocally(mediaId, blob);
				}
				setPreviewSrc(window.URL.createObjectURL(blob));
				setMediaDownloadStatus('downloaded');
			})
			.catch(() => setMediaDownloadStatus('error'));
	}, [metadata, message, mediaId]);

	return (
		<ChatMessageWrapper message={message}>
			{!mediaId ? (
				<>
					<p className='text-center text-destructive my-2'>No Preview Available</p>
					{message.body?.caption ? <p className=''>{message.body?.caption}</p> : null}
				</>
			) : !metadata.loaded ? (
				<div className='w-full' ref={inViewRef}>
					<div className='flex justify-center items-center  w-[260px] aspect-video bg-gray-200 rounded-lg'>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</div>
				</div>
			) : mediaDownloadStatus === 'pending' ? (
				<div className='w-full relative'>
					<div className='flex justify-center items-center w-[16.25rem] aspect-video bg-gray-200 rounded-lg'>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 opacity-80 w-fit-content px-4 h-10 rounded-full'>
						<div
							className='flex gap-2 cursor-pointer items-center justify-center h-full'
							onClick={handlePreview}
						>
							<ArrowDownToLine className='w-4 h-4 text-white' />
							<p className='text-white text-sm'>{getFileSize(metadata.size)}</p>
						</div>
					</div>
				</div>
			) : mediaDownloadStatus === 'downloading' ? (
				<div className='w-full relative'>
					<div className='flex justify-center items-center w-[16.25rem] aspect-video bg-gray-200 rounded-lg'>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 opacity-80 w-fit-content px-3 h-10 rounded-full'>
						<div className='flex gap-2 cursor-pointer items-center justify-center h-full'>
							<Loader2 className='w-4 h-4 text-white animate-spin' />
						</div>
					</div>
				</div>
			) : (
				<div className='flex flex-col w-full aspect-square relative mx-auto'>
					<div className=' mx-auto h-[94%] aspect-square'>
						<PreviewFile
							data={{
								url: previewSrc,
								type: getFileType(metadata.mimeType),
							}}
							error={() => setMediaDownloadStatus('error')}
						/>
					</div>
					{message.body?.caption ? <p className=''>{message.body?.caption}</p> : null}
					<p className=' text-center cursor-pointer underline' onClick={handleDownload}>
						Download
					</p>
				</div>
			)}
		</ChatMessageWrapper>
	);
};

const ContactMessage = ({ message }: { message: TMessage }) => {
	const { value: isOpen, on: open, off: close } = useBoolean();
	return (
		<Each
			items={(message.body?.contacts ?? []) as Contact[]}
			render={(contact, index) => (
				<>
					<ChatMessageWrapper message={message}>
						<div>
							<div className='flex gap-2'>
								<Avatar className='w-6 h-6'>
									<AvatarFallback>
										{getInitials(contact.name?.formatted_name ?? ' ').charAt(0)}
									</AvatarFallback>
								</Avatar>
								<p className='flex-1'>{contact.name?.formatted_name}</p>
							</div>
							<Separator className='my-2 bg-gray-300' />

							<p
								className='text-sm cursor-pointer text-center text-primary hover:underline'
								onClick={open}
							>
								View Contact
							</p>
						</div>
					</ChatMessageWrapper>
					{isOpen && (
						<ContactDialog
							defaultValues={
								{
									id: '',
									...contact,
								} as Contact
							}
							canEdit={false}
							onClose={close}
						/>
					)}
				</>
			)}
		/>
	);
};

const UnknownMessage = ({ message }: { message: TMessage }) => {
	return (
		<ChatMessageWrapper message={message}>
			<div className='flex flex-col'>
				<ShieldX className='w-8 h-8 text-destructive' />
				<div>
					<p className='font-medium'>Unknown Message Type</p>
					<p className='whitespace-pre-wrap text-sm'>This message cannot be rendered here.</p>
				</div>
			</div>
		</ChatMessageWrapper>
	);
};
