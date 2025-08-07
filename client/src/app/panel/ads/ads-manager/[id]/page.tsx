import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { AdCampaignService } from '@/services/ad-campaign.service';
import { getAdInsights } from '../../actions';
import AdPreview from '../../create/_components/ad-preview';
import { ExportButton, PauseButton, ResumeButton } from '../_components/buttons';

export default async function AdsInsights({ params }: { params: { id: string } }) {
	const { id } = params;
	const data = await getAdInsights(id);
	if (!data.success) {
		return <div className='flex-1 text-center text-gray-500'>{data.error}</div>;
	}
	const details = data.details!;

	const page_details = await AdCampaignService.getPageDetails();
	const selected_page_name =
		page_details.pages.find((page) => page.id === page_details.page_id)?.name ?? '';

	const insights = data.insights ? ('message' in data.insights ? null : data.insights) : null;
	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='flex justify-end gap-4'>
				{details.status === 'ACTIVE' ? <PauseButton ad_id={id} /> : <ResumeButton ad_id={id} />}
				<ExportButton ad_id={id} />
			</div>
			<div className='flex flex-wrap gap-4 justify-center'>
				<div className='w-full flex gap-4 flex-col lg:flex-row'>
					<div className='mx-6 flex flex-col gap-4'>
						<AdPreview
							details={details!}
							page_name={selected_page_name}
							icon={page_details.page_icon}
						/>
					</div>

					{details ? (
						<div className='flex flex-col gap-4 flex-1'>
							<div className='h-fit  border-dashed border-2 border-gray-300 rounded-lg'>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Status:
												<span className='ml-auto capitalize'>{details.status.toLowerCase()}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Delivery Status:
												<span className='ml-auto capitalize'>
													{details.effective_status.toLowerCase()}
												</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Starts:
												<span className='ml-auto'>{details.start_time}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Ends:
												<span className='ml-auto'>{details.end_time}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Age:
												<span className='ml-auto'>
													{details.targeting?.age_min} - {details.targeting?.age_max}
												</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Gender:
												<span className='ml-auto'>
													{details.targeting.genders?.includes(1) &&
													details.targeting.genders?.includes(2)
														? 'All'
														: details.targeting.genders?.includes(1)
														? 'Male'
														: 'Female'}
												</span>
											</TableCell>
										</TableRow>
										<TableRow hidden={!details.targeting?.geo_locations?.cities}>
											<TableCell className='w-full inline-flex justify-between'>
												Cities
												<span className='ml-auto'>
													{(details.targeting?.geo_locations?.cities ?? [])
														.map((city) => city.name)
														.join(', ')}
												</span>
											</TableCell>
										</TableRow>
										<TableRow hidden={!details.targeting?.geo_locations?.countries}>
											<TableCell className='w-full inline-flex justify-between'>
												Countries
												<span className='ml-auto'>
													{(details.targeting?.geo_locations?.countries ?? []).join(', ')}
												</span>
											</TableCell>
										</TableRow>
										<TableRow hidden={!details.targeting?.geo_locations?.regions}>
											<TableCell className='w-full inline-flex justify-between'>
												Regions
												<span className='ml-auto'>
													{(details.targeting?.geo_locations?.regions ?? [])
														.map((region) => region.name)
														.join(', ')}
												</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
							<div
								hidden={
									details.targeting.others.life_events.length === 0 &&
									details.targeting.others.industries.length === 0 &&
									details.targeting.others.income.length === 0 &&
									details.targeting.others.family_statuses.length === 0
								}
								className='h-fit  border-dashed border-2 border-gray-300 rounded-lg'
							>
								<Table>
									<TableBody>
										<TableRow hidden={details.targeting.others.life_events.length === 0}>
											<TableCell className='w-full inline-flex justify-between'>
												Life Events:
												<span className='ml-auto capitalize'>
													{(details.targeting?.others?.life_events ?? [])
														.map((event) => event.name)
														.join(', ')}
												</span>
											</TableCell>
										</TableRow>
										<TableRow hidden={details.targeting.others.industries.length === 0}>
											<TableCell className='w-full inline-flex justify-between'>
												Industries:
												<span className='ml-auto capitalize'>
													{(details.targeting?.others?.industries ?? [])
														.map((industry) => industry.name)
														.join(', ')}
												</span>
											</TableCell>
										</TableRow>
										<TableRow hidden={details.targeting.others.income.length === 0}>
											<TableCell className='w-full inline-flex justify-between'>
												Income:
												<span className='ml-auto capitalize'>
													{(details.targeting?.others?.income ?? [])
														.map((income) => income.name)
														.join(', ')}
												</span>
											</TableCell>
										</TableRow>
										<TableRow hidden={details.targeting.others.family_statuses.length === 0}>
											<TableCell className='w-full inline-flex justify-between'>
												Family Statuses:
												<span className='ml-auto capitalize'>
													{(details.targeting?.others?.family_statuses ?? [])
														.map((status) => status.name)
														.join(', ')}
												</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>
					) : (
						<></>
					)}
					{insights ? (
						<div className='h-fit flex-1 flex flex-col gap-4'>
							<div className=' flex-1 border-dashed border-2 border-gray-300 rounded-lg'>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Spent:
												<span className='ml-auto'>
													{insights.account_currency} {insights.spend ?? 0}
												</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Impressions:
												<span className='ml-auto'>{insights.impressions ?? 0}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Reach:
												<span className='ml-auto'>{insights.reach ?? 0}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Clicks:
												<span className='ml-auto'>{insights.clicks ?? 0}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Click-through rate:
												<span className='ml-auto'>{Number(insights.ctr ?? 0).toFixed(2)}</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
							<div className=' flex-1 border-dashed border-2 border-gray-300 rounded-lg'>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Cost per unique click:
												<span className='ml-auto'>
													{Number(insights.cost_per_unique_click ?? 0).toFixed(2)}
												</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Cost per click:
												<span className='ml-auto'>{Number(insights.cpc ?? 0).toFixed(2)}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Cost per mille :
												<span className='ml-auto'>{Number(insights.cpm ?? 0).toFixed(2)}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Cost per purchase:
												<span className='ml-auto'>{Number(insights.cpp ?? 0).toFixed(2)}</span>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='w-full inline-flex justify-between'>
												Frequency:
												<span className='ml-auto'>
													{Number(insights.frequency ?? 0).toFixed(2)}
												</span>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</div>
					) : (
						<div className='flex-1 text-center text-gray-500'>No insights available</div>
					)}
				</div>
			</div>
		</div>
	);
}
