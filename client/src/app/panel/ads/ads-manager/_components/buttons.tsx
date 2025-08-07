'use client';

import { Button } from '@/components/ui/button';
import { AdCampaignService } from '@/services/ad-campaign.service';
import toast from 'react-hot-toast';
import { updateAdStatus } from '../../actions';

export function PauseButton({ ad_id }: { ad_id: string }) {
	function handleClick() {
		toast.promise(updateAdStatus(ad_id, 'PAUSED'), {
			loading: 'Pausing...',
			success: 'Ad paused successfully',
			error: (error) => error.message,
		});
	}
	return (
		<Button variant={'destructive'} onClick={handleClick}>
			Pause
		</Button>
	);
}

export function ResumeButton({ ad_id }: { ad_id: string }) {
	function handleClick() {
		toast.promise(updateAdStatus(ad_id, 'ACTIVE'), {
			loading: 'Resuming...',
			success: 'Ad resumed successfully',

			error: (error) => error.message,
		});
	}
	return (
		<Button variant={'default'} onClick={handleClick}>
			Resume
		</Button>
	);
}

export function ExportButton({ ad_id }: { ad_id: string }) {
	function handleClick() {
		toast.promise(AdCampaignService.exportAdConversations(ad_id), {
			loading: 'Exporting...',
			success: 'Ad conversations exported successfully',
			error: (error) => error.message,
		});
	}
	return (
		<Button variant={'secondary'} className='border-2' onClick={handleClick}>
			Export
		</Button>
	);
}
