import AuthService from '@/services/auth.service';
import { notFound } from 'next/navigation';
import RecurringCampaign from '../_components/RecurringCampaign';

export default async function CreateRecurring() {
	const userDetails = await AuthService.userDetails();

	if (!userDetails?.permissions.recurring.create) {
		return notFound();
	}

	return <RecurringCampaign />;
}
