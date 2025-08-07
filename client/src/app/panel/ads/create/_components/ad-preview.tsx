import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LinkPreview } from '@/components/ui/link-preview';
import { AdDetails } from '@/services/ad-campaign.service';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Globe, Share2, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { MdOutlinePermMedia } from 'react-icons/md';

export default function AdPreview({
	details,
	page_name,
	icon,
}: {
	details: Omit<
		AdDetails,
		'ad_id' | 'status' | 'targeting' | 'bid_amount' | 'start_time' | 'end_time' | 'effective_status'
	>;
	page_name: string;
	icon: string;
}) {
	return (
		<LinkIfExists url={details.post_url ?? ''}>
			<div className='border m-auto border-gray-200 rounded-lg max-w-[420px]'>
				<section id='header' className='p-4 flex items-center justify-between gap-2'>
					<div className='flex items-center gap-2'>
						<Avatar>
							<AvatarImage src={icon} />
							<AvatarFallback>W</AvatarFallback>
						</Avatar>
						<div className='flex flex-col gap-1'>
							<div className='font-medium'>{page_name}</div>
							<div className='text-sm text-gray-500 inline-flex gap-1 items-center'>
								@wautopilot.com
								<LinkPreview
									url={details.ad_website_link ? details.ad_website_link : 'https://guthib.com/'}
								>
									<Globe className='w-4 h-4' />
								</LinkPreview>
							</div>
						</div>
					</div>
					<div>
						<DotsHorizontalIcon className='cursor-pointer w-4 h-4' />
					</div>
				</section>
				<section id='caption' className='p-4 '>
					{details.ad_message ? (
						<div className='text-sm text-gray-500 whitespace-pre-wrap'>
							{details.ad_message}
						</div>
					) : (
						<div className='text-sm text-gray-500'>Enter caption</div>
					)}
				</section>
				<section
					id='media'
					className='aspect-square bg-gray-200 flex items-center justify-center relative '
				>
					{details.ad_video_url ? (
						<>
							<video
								className='w-full h-[calc(100%-5rem)] -mt-[5rem]  object-cover'
								autoPlay={true}
								controls
								muted
							>
								<source src={details.ad_video_url} type='video/mp4' />
							</video>
						</>
					) : details.ad_picture ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={details.ad_picture} alt='ad-media' className='w-full h-full object-cover' />
					) : (
						<MdOutlinePermMedia size={'2.5rem'} color='white' className='self-center' />
					)}
					<div className='h-[5rem] p-4 flex justify-between absolute bottom-0 w-full from-white/60 to-white bg-gradient-to-b'>
						<div className=''>
							<div className='text-primary font-medium'>WHATSAPP</div>
							<div className='text-sm text-gray-500 break-all line-clamp-2'>
								{details.ad_description ? details.ad_description : 'Enter description'}
							</div>
						</div>
						<Button type='button' variant='outline'>
							<FaWhatsapp className='mr-2' />
							WhatsApp
						</Button>
					</div>
				</section>
				<section id='interaction' className='p-4 flex justify-between border-t-2'>
					<Button type='button' variant={'ghost'}>
						<ThumbsUp className='mr-2 w-4 h-4 text-primary' />
						Like
					</Button>
					<Button type='button' variant={'ghost'}>
						<Share2 className='mr-2 w-4 h-4 text-primary' />
						Share
					</Button>
				</section>
			</div>
		</LinkIfExists>
	);
}

function LinkIfExists({ url, children }: { url: string; children: ReactNode }) {
	if (!url) return children;
	return (
		<Link href={url} target='_blank' className='block'>
			{children}
		</Link>
	);
}
