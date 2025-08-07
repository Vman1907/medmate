import Show from '@/components/containers/show';
import { AdCampaignService } from '@/services/ad-campaign.service';
import CreateNewListDialog from './_components/create-list-dialog';
import AudienceList from './_components/data';

export default async function CustomAudiencePage() {
	const { list, error, success } = await AdCampaignService.getCustomerAudienceList();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='flex justify-between md:flex-row flex-col'>
				<h2 className='text-xl'>Custom Audience</h2>
				<div className='inline-flex  gap-4'>
					<CreateNewListDialog />
				</div>
			</div>
			<Show>
				<Show.When condition={!success}>
					<p>{error}</p>
				</Show.When>
				<Show.Else>
					<AudienceList list={list} />
				</Show.Else>
			</Show>
		</div>
	);
}
