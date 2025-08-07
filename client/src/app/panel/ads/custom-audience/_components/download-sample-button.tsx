'use client';

import { Button } from '@/components/ui/button';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DownloadSampleButton() {
	const download = () => {
		toast.promise(AdCampaignService.downloadSampleAudienceCSV(), {
			success: 'Sample downloaded successfully',
			error: 'Failed to download sample',
			loading: 'Downloading sample...',
		});
	};

	return (
		<Button onClick={download}>
			<Download className='w-4 h-4 mr-2' />
			Download Sample
		</Button>
	);
}
