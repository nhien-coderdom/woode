/**
 * Membership Tier Configuration
 * Single source of truth for all tier-related constants
 */

export type LoyaltyTierType = 'NORMAL' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface TierConfig {
  key: LoyaltyTierType;
  name: string;
  min: number;
  max: number;
  discount: number; // percentage (0-100)
  displayName: string;
}

export const MEMBERSHIP_TIERS: TierConfig[] = [
  {
    key: 'NORMAL',
    name: 'Normal',
    displayName: 'Thường',
    min: 0,
    max: 9999999,
    discount: 0,
  },
  {
    key: 'SILVER',
    name: 'Silver',
    displayName: 'Bạc',
    min: 10000000,
    max: 49999999,
    discount: 0,
  },
  {
    key: 'GOLD',
    name: 'Gold',
    displayName: 'Vàng',
    min: 50000000,
    max: 199999999,
    discount: 5,
  },
  {
    key: 'PLATINUM',
    name: 'Platinum',
    displayName: 'Bạch Kim',
    min: 200000000,
    max: Infinity,
    discount: 10,
  },
];

export function getTierBySpent(totalSpent: number): TierConfig {
  return (
    MEMBERSHIP_TIERS.find(
      (tier) => totalSpent >= tier.min && totalSpent <= tier.max,
    ) || MEMBERSHIP_TIERS[0]
  );
}

export function calculateLoyaltyTier(totalSpent: number): LoyaltyTierType {
  return getTierBySpent(totalSpent).key;
}

export function getDiscountPercentageBySpent(totalSpent: number): number {
  const tier = getTierBySpent(totalSpent);
  return tier.discount / 100;
}

export function getDiscountPercentageByTier(tierKey: LoyaltyTierType): number {
  const tier = MEMBERSHIP_TIERS.find((t) => t.key === tierKey);
  return tier ? tier.discount / 100 : 0;
}

export function getNextTier(totalSpent: number): TierConfig | null {
  const currentIndex = MEMBERSHIP_TIERS.findIndex(
    (tier) => totalSpent >= tier.min && totalSpent <= tier.max,
  );

  if (currentIndex === -1 || currentIndex === MEMBERSHIP_TIERS.length - 1) {
    return null;
  }

  return MEMBERSHIP_TIERS[currentIndex + 1];
}

export function getAmountToNextTier(totalSpent: number): number {
  const nextTier = getNextTier(totalSpent);
  return nextTier ? Math.max(0, nextTier.min - totalSpent) : 0;
}

// 10% tổng tiền gốc đơn hàng
export const LOYALTY_POINTS_MULTIPLIER = 0.1;

export function calculateEarnedPoint(total: number): number {
  return Math.floor(total * LOYALTY_POINTS_MULTIPLIER);
}

export function getMonthlyResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
}