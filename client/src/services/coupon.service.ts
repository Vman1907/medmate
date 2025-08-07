import { apiClient } from '@/lib/apiClient';
import { REVALIDATE_TAGS } from '@/lib/consts';
import { Coupon } from '@/schema/coupon';

export default class CouponService {
	static async listCoupons() {
		try {
			const data = await apiClient.get<{ list: any[] }>('/coupon', {
				tags: [REVALIDATE_TAGS.COUPON],
			});
			return (data.list ?? []).map((coupon: any) => {
				return {
					id: coupon.id,
					couponCode: coupon.code ?? '',
					availableCoupon: (coupon.available_coupons ?? 0).toString(),
					couponPerUser: (coupon.count_per_user ?? 0).toString(),
					discountAmount: (coupon.discount_amount ?? 0).toString(),
					discountPercentage: (coupon.discount_percentage ?? 0).toString(),
					discountType: coupon.discount_type ?? 'percentage',
					totalCoupons: (coupon.total_coupons ?? 0).toString(),
				};
			}) as Coupon[];
		} catch (err) {
			return null;
		}
	}
	static async createCoupon(coupon: {
		code: string;
		total_coupons: number;
		discount_type: 'percentage' | 'amount';
		discount_amount?: number;
		discount_percentage?: number;
		count_per_user: number;
	}) {
		if (coupon.discount_type === 'amount') {
			delete coupon.discount_percentage;
		}
		await apiClient.post('/coupon', coupon);
		await apiClient.revalidateTag(REVALIDATE_TAGS.COUPON);
	}
	static async updateCoupon(
		id: string,
		coupon: {
			code: string;
			total_coupons: number;
			discount_type: 'percentage' | 'amount';
			discount_amount?: number;
			discount_percentage?: number;
			count_per_user: number;
		}
	) {
		if (coupon.discount_type === 'percentage') {
			delete coupon.discount_amount;
		}
		await apiClient.put(`/coupon/${id}`, coupon);
		await apiClient.revalidateTag(REVALIDATE_TAGS.COUPON);
	}
	static async deleteCoupon(id: string) {
		await apiClient.delete(`/coupon/${id}`);
		await apiClient.revalidateTag(REVALIDATE_TAGS.COUPON);
	}
}
