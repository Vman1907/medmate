import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdCampaignService } from '@/services/ad-campaign.service';
import DataTable from './_components/data-table';
import StatsTemplate from './_components/statsTemplate';
export default async function AdsManagerPage() {
	const { ads, error: ads_error } = await AdCampaignService.getAds();
	const { insights, error: insights_error } = await AdCampaignService.getInsights();

	const wautopilot_ads = ads.filter((ad) => ad.is_created_by_wautopilot);
	const user_ads = ads.filter((ad) => !ad.is_created_by_wautopilot);

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			{insights ? (
				<div className='flex flex-wrap gap-4 justify-center'>
					<StatsTemplate
						tooltip='The average amount spent to get one unique user to click on your ad.'
						color='bg-green-300'
						label='Cost per unique click'
						value={`INR ${Number(insights.cost_per_unique_click).toFixed(2)}`}
					/>
					<StatsTemplate
						tooltip='The currency of your account.'
						color='bg-red-300'
						label='Account currency'
						value={insights.account_currency}
					/>
					<StatsTemplate
						tooltip='The total amount of money you have spent on ads.'
						color='bg-yellow-300'
						label='Spend'
						value={`${insights.account_currency} ${Number(insights.spend).toFixed(2)}`}
					/>
					<StatsTemplate
						tooltip='The total number of times your ad was displayed to users.'
						color='bg-purple-300'
						label='Impressions'
						value={insights.impressions}
					/>
					<StatsTemplate
						tooltip='The total number of unique users who have seen your ad.'
						color='bg-pink-300'
						label='Reach'
						value={insights.reach}
					/>
					<StatsTemplate
						tooltip='The average number of times your ad was displayed to each unique user.'
						color='bg-teal-300'
						label='Frequency'
						value={Number(insights.frequency).toFixed(2)}
					/>
					<StatsTemplate
						tooltip='The percentage of users who clicked on your ad.'
						color='bg-orange-300'
						label='Click-through rate'
						value={`${Number(insights.ctr).toFixed(2)}`}
					/>
					<StatsTemplate
						tooltip='The average cost incurred to generate a single purchase from your ad.'
						color='bg-indigo-300'
						label='Cost Per Purchase'
						value={`${insights.account_currency} ${Number(insights.cpp).toFixed(2)}`}
					/>
					<StatsTemplate
						tooltip='The average amount spent to get one unique user to click on your ad.'
						color='bg-lime-300'
						label='Cost Per Click'
						value={`${insights.account_currency} ${Number(insights.cpc).toFixed(2)}`}
					/>
					<StatsTemplate
						tooltip='The average cost to reach 1,000 impressions of your ad.'
						color='bg-emerald-300'
						label='Cost Per Mille'
						value={`${insights.account_currency} ${Number(insights.cpm).toFixed(2)}`}
					/>
					<StatsTemplate
						tooltip='The total number of clicks your ad received.'
						color='bg-gray-300'
						label='Clicks'
						value={insights.clicks}
					/>
				</div>
			) : (
				<div className='flex flex-wrap gap-4 justify-center'>
					<div className='text-center text-lg font-bold'>{insights_error}</div>
				</div>
			)}
			<Tabs defaultValue='wautopilot' className='w-full relative'>
				<TabsList className='w-fit absolute top-5'>
					<TabsTrigger value='wautopilot'>Wautopilot</TabsTrigger>
					<TabsTrigger value='meta'>META</TabsTrigger>
				</TabsList>
				<TabsContent value='wautopilot'>
					<DataTable records={wautopilot_ads ?? []} error={ads_error} />
				</TabsContent>
				<TabsContent value='meta'>
					<DataTable records={user_ads ?? []} error={ads_error} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
