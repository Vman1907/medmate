import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AdCampaignService } from '@/services/ad-campaign.service';
import Link from 'next/link';
import { ConfigAccountSetup, ConfigPageSetup } from './_components/config-setup';
import {
	DisconnectButton,
	LinkFacebookAccountButton,
} from './_components/link-facebook-account-button';
import { AdNumberInput } from './_components/number-input';

export default async function AdsSetup() {
	const data = await AdCampaignService.getPageDetails();

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Setup Your Ad Account</h2>
			</div>
			<section className='w-full mt-[7%] p-4 md:max-w-6xl border-2 rounded-lg self-center shadow-lg'>
				<div className='grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-left gap-4'>
					<div>
						<div>Connect your Facebook account</div>
						<div className='text-sm text-muted-foreground'>
							Allow Wautopilot to receive advertisement analytics and event from Facebook
						</div>
					</div>
					<div className='flex'>
						<Show>
							<Show.When condition={data.is_registered}>
								<DisconnectButton />
							</Show.When>
							<Show.Else>
								<LinkFacebookAccountButton />
							</Show.Else>
						</Show>
					</div>
				</div>

				<Separator className='my-6' />

				<div className='grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-left gap-4'>
					<div>
						<div>Choose your Ad Account</div>
						<div className='text-sm text-muted-foreground'>
							Select Facebook page which will be used for advertisement
						</div>
					</div>
					<div className='flex'>
						<ConfigAccountSetup value={data.ad_account_id} items={data.ad_accounts} />
					</div>
				</div>

				<Separator className='my-6' />

				<div className='grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-left gap-4'>
					<div>
						<div>Choose your Facebook page</div>
						<div className='text-sm text-muted-foreground'>
							Select Facebook page which will be used for advertisement
						</div>
					</div>
					<ConfigPageSetup value={data.page_id} items={data.pages} />
				</div>

				<Separator className='my-6' />

				<div className='grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-left gap-4'>
					<div>
						<div>Link Whatsapp Number</div>
						<div className='text-sm text-muted-foreground'>
							Link your WhatsApp Business number with selected Facebook Page to receive messages
							directly over WhatsApp
						</div>
					</div>
					<div className='flex justify-center w-full'>
						{data.is_number_verified ? (
							<div className='flex flex-col md:flex-row justify-end items-end gap-2 flex-1'>
								<Input disabled value={data.whatsapp_number} className='text-right' type='tel' />
							</div>
						) : (
							<AdNumberInput disabled={!data.is_registered} />
						)}
					</div>
				</div>

				<Separator className='my-6' />

				<div className='grid grid-cols-1 md:grid-cols-2 items-center text-center md:text-left gap-4'>
					<div>
						<div>Create Advertisement</div>
						<div className='text-sm text-muted-foreground'>
							Click Create Ad to start receiving leads directly on your WhatsApp
						</div>
					</div>
					<div className='flex justify-end w-full'>
						<Link href='/panel/ads/create'>
							<Button disabled={!data.is_registered || !data.is_number_verified}>Create Ad</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
