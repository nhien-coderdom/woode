import {
  calculateLoyaltyTier,
  getDiscountPercentageBySpent,
  getMonthlyResetDate,
  LOYALTY_POINTS_MULTIPLIER,
} from '../config/tiers.constants.js';

// Re-export for backward compatibility
export {
  calculateLoyaltyTier,
  getMonthlyResetDate,
  LOYALTY_POINTS_MULTIPLIER as POINTS_MULTIPLIER,
};

/**
 * Calculate earned loyalty points from final total amount paid
 * @param finalAmount Final amount customer actually paid (after usedPoint and tierDiscount)
 * @returns Earned points (10% of final amount paid)
 * 
 * Points are calculated from the actual amount paid:
 * finalAmount = subtotal - usedPoint - tierDiscount
 * earnedPoints = 10% of finalAmount
 * 
 * Points are only added to user when order status = COMPLETED
 */
export function calculateEarnedPoints(finalAmount: number): number {
  return Math.floor(finalAmount * LOYALTY_POINTS_MULTIPLIER);
}

/**
 * Get discount percentage for a spent amount (legacy function name)
 * @param totalSpent Total spent amount
 * @returns Discount percentage as decimal (e.g., 0.05 for 5%)
 */
export function getDiscountPercentageByTier(totalSpent: number): number {
  return getDiscountPercentageBySpent(totalSpent);
}
