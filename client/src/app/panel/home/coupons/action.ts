'use server';

import CouponService from '@/services/coupon.service';

export async function editCoupon(
	id: string,
	coupon: {
		code: string;
		total_coupons: number;
		discount_type: 'percentage' | 'amount';
		discount_amount: number;
		discount_percentage: number;
		count_per_user: number;
	}
) {
	await CouponService.updateCoupon(id, coupon);
}

export async function createCoupon(coupon: {
	code: string;
	total_coupons: number;
	discount_type: 'percentage' | 'amount';
	discount_amount: number;
	discount_percentage: number;
	count_per_user: number;
}) {
	await CouponService.createCoupon(coupon);
}

export async function deleteCoupon(id: string) {
	await CouponService.deleteCoupon(id);
}
