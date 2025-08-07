'use server';

import { revalidate } from '@/lib/actions';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { AdType } from '@/schema/ad-page-details';
import { AdCampaignService } from '@/services/ad-campaign.service';

export const generateAuthToken = async (code: string) => {
	await AdCampaignService.generateAuthToken(code);
};

export const updateDetails = async (
	details: Partial<{
		page_id: string;
		ad_account_id: string;
	}>
) => {
	await AdCampaignService.updatePageDetails(details);
};

export const updateNumber = async (number: string) => {
	const res = await AdCampaignService.updateNumber(number);
	if (res.verification_code_sent) {
		return res;
	} else {
		revalidate(REVALIDATE_TAGS.PAGE);
		return res;
	}
};

export const verifyNumber = async (code: string) => {
	return await AdCampaignService.verifyNumber(code);
};

export const getAdInsights = async (id: string) => {
	return await AdCampaignService.getAdInsights(id);
};

export const createAd = async (details: AdType) => {
	await AdCampaignService.createAd(details);
};

export const updateAdStatus = async (ad_id: string, status: 'ACTIVE' | 'PAUSED') => {
	const res = await AdCampaignService.updateAdStatus(ad_id, status);
	if (!res.success) {
		throw new Error(res.error);
	}
};

export const disconnectPage = async () => {
	await AdCampaignService.disconnectPage();
};
