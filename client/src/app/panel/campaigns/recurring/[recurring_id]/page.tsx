import AuthService from '@/services/auth.service';
import RecurringService from '@/services/recurring.service';
import { notFound } from 'next/navigation';
import RecurringCampaign from '../_components/RecurringCampaign';

// const data = {
// 	name: 'birthday test',
// 	description: '',
// 	template_id: '1523000151653254',
// 	template_name: '234',
// 	wish_from: 'birthday',
// 	labels: ['Developer'],
// 	delay: 0,
// 	startTime: '10:00',
// 	endTime: '18:00',
// 	header: {
// 		type: 'TEXT',
// 		media_id: '',
// 		text: [
// 			{
// 				custom_text: 'wqe',
// 				variable_from: 'custom_text',
// 				phonebook_data: '',
// 				fallback_value: '',
// 			},
// 		],
// 	},
// 	body: [
// 		{
// 			custom_text: 'qwe',
// 			variable_from: 'custom_text',
// 			phonebook_data: '',
// 			fallback_value: '',
// 		},
// 	],
// 	buttons: [],
// 	id: '670cb7373cf68d07f6e2b15a',
// };

export default async function EditRecurring({
	params: { recurring_id },
}: {
	params: { recurring_id: string };
}) {
	const [data, userDetails] = await Promise.all([
		RecurringService.getRecurring(recurring_id),
		AuthService.userDetails(),
	]);

	if (!data || !userDetails?.permissions.recurring.update) {
		notFound();
	}

	return <RecurringCampaign data={data} id={recurring_id} />;
}
