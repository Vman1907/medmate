export type AdList = {
	id: string;
	name: string;
	status: string;
	start_time: string;
	end_time: string;
	bid_amount: number;
	is_created_by_wautopilot: boolean;
};

export type Insights = {
	cost_per_unique_click: string;
	account_currency: string;
	spend: string;
	reach: string;
	impressions: string;
	frequency: string;
	ctr: string;
	cpp: string;
	cpm: string;
	cpc: string;
	clicks: string;
};

export type AdResponseType = {
	id: string;
	ad_id: string;
	ad_name: string;
	status: 'ACTIVE' | 'PAUSED';
	created_at: string;
	age_min: number;
	age_max: number;
	genders: number[];
	geo_locations: {
		key: string;
		name: string;
		location_type: string;
		country_code: string;
		_id: string;
	}[];
	start_time: string;
	end_time: string;
	ad_message: string;
	ad_description: string;
	ad_website_link: string;
};

export type MetaAudienceGroup = {
	id: string;
	name: string;
	description: string;
	lower_bound: number;
	upper_bound: number;
	operation_status: string;
	delivery_status: string;
};
