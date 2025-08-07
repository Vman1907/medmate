'use client';
import PreviewFile from '@/components/elements/preview-file';
import api from '@/lib/api';
import { SERVER_URL } from '@/lib/consts';
import { parseToMaxTime } from '@/lib/utils';
import { Handle, Position, useNodeId } from '@xyflow/react';
import { useEffect, useState } from 'react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function ImageNode({
	data: { id, caption, delay, reply_to_message },
}: {
	data: {
		id: string;
		caption: string;
		delay: number;
		reply_to_message: boolean;
	};
}) {
	const nodeId = useNodeId();

	const [data, setData] = useState<{
		blob: Blob | MediaSource | null;
		url: string | null;
		type: string;
		size: string;
		filename: string;
	} | null>(null);

	useEffect(() => {
		api
			.get(`${SERVER_URL}/media/${id}/download`, {
				responseType: 'blob',
			})
			.then((response) => {
				const contentDisposition = response.headers['content-disposition'];
				const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
				const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

				const { data: blob } = response;
				const url = window.URL.createObjectURL(blob);
				const fileType = blob.type as string;
				const fileSizeBytes = blob.size as number;
				let type = '';

				if (fileType.includes('image')) {
					type = 'image';
				} else if (fileType.includes('video')) {
					type = 'video';
				} else if (fileType.includes('pdf')) {
					type = 'PDF';
				} else if (fileType.includes('audio')) {
					type = fileType;
				}

				const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
				const fileSizeMB = fileSizeKB / 1024;
				setData({
					blob,
					url,
					type,
					size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
					filename,
				});
			});
	}, [id]);

	return (
		<>
			<Handle
				type='target'
				position={Position.Left}
				style={{ ...dotStyle, top: 25 }}
				isConnectable
			/>

			<Handle
				type='source'
				id={nodeId!}
				position={Position.Right}
				style={{ ...dotStyle, top: 25 }}
				isConnectable
			/>
			<div className='rounded-2xl bg-gray-200 min-w-[400px] min-h-max-content shadow-2xl drop-shadow-2xl'>
				<div className='bg-blue-400 text-center text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					Image Message
				</div>
				{delay > 0 ? (
					<div className='p-1 text-center text-sm '>Send after {parseToMaxTime(delay)}</div>
				) : (
					<div className='p-1 text-center text-sm '>Send immediately</div>
				)}
				{reply_to_message && <div className='p-1 text-center text-sm '>Reply to message</div>}
				<div className='p-2'>
					<div className='rounded-lg border border-black p-2 max-h-[400px] max-w-[400px]'>
						<PreviewFile
							data={data?.url ? { url: data.url, type: data.type } : null}
							progress={-1}
						/>
					</div>
					<div className='rounded-lg border border-black p-2 mt-2' hidden={!caption}>
						{caption.split('\n').map((line, i) => (
							<p key={i} className='text-sm'>
								{line}
							</p>
						))}
					</div>
				</div>
			</div>

			{/* <RenderButtonHandles /> */}
		</>
	);
}
