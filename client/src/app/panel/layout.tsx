import PageLayout from '@/components/containers/page-layout';
import { DevicesStateProvider } from '@/components/context/devicesState';
import { SettingStateProvider } from '@/components/context/settingState';
import { FieldsContextProvider, TagsProvider } from '@/components/context/tags';
import { UserDetailsProvider } from '@/components/context/user-details';
import BalanceAlertDialog from '@/components/elements/dialogs/balance-alert-dialog';
import DevicesDialog from '@/components/elements/dialogs/devices';
import SettingsDialog from '@/components/elements/dialogs/settings';
import SubscriptionAlertDialog from '@/components/elements/dialogs/subscription-alert-dialog';
import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import PrefetchRoutes from '@/components/elements/PrefetchRoutes';
import AuthService from '@/services/auth.service';
import { DashboardService } from '@/services/dashboard.service';
import DeviceService from '@/services/device.service';
import PhoneBookService from '@/services/phonebook.service';
import PreferencesService from '@/services/preferences.service';
import { Metadata } from 'next';
import { Suspense } from 'react';
import DevicesAlertDialog from '../../components/elements/dialogs/devices-alert';

export const metadata: Metadata = {
	title: 'Dashboard • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [userDetails, { labels, fields }, devices, dashboardDetails, preferences] =
		await Promise.all([
			AuthService.userDetails(),
			PhoneBookService.allLabels(),
			DeviceService.listDevices(),
			DashboardService.getDashboardData(),
			PreferencesService.getPreferences(),
		]);

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<PrefetchRoutes />
				<UserDetailsProvider data={{ ...userDetails!, preferences }}>
					<SettingStateProvider>
						<DevicesStateProvider data={devices}>
							<BalanceAlertDialog />
							<DevicesAlertDialog />
							<DevicesDialog />
							<SettingsDialog />
							<SubscriptionAlertDialog />
							<Navbar numberHealth={dashboardDetails?.health ?? 'UNKNOWN'} />
							<PageLayout className='overflow-scroll'>
								<TagsProvider data={labels}>
									<FieldsContextProvider data={fields}>{children}</FieldsContextProvider>
								</TagsProvider>
							</PageLayout>
						</DevicesStateProvider>
					</SettingStateProvider>
				</UserDetailsProvider>
			</main>
		</Suspense>
	);
}
