/**
 * Membership Tier Configuration (Frontend)
 * Should be kept in sync with woode-api/src/config/tiers.constants.ts
 */

export type LoyaltyTierType = 'NORMAL' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface TierConfig {
  key: LoyaltyTierType;
  name: string;
  displayName: string;
  min: number;
  max: number;
  discount: number; // percentage (0-100)
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

/**
 * Get tier configuration by spent amount
 */
export function getTierBySpent(totalSpent: number): TierConfig {
  return (
    MEMBERSHIP_TIERS.find(
      (t) => totalSpent >= t.min && totalSpent <= t.max,
    ) || MEMBERSHIP_TIERS[0]
  );
}

/**
 * Get next tier for a spent amount (null if already at max)
 */
export function getNextTier(totalSpent: number): TierConfig | null {
  const currentIndex = MEMBERSHIP_TIERS.findIndex(
    (t) => totalSpent >= t.min && totalSpent <= t.max,
  );

  if (currentIndex === -1 || currentIndex === MEMBERSHIP_TIERS.length - 1) {
    return null;
  }

  return MEMBERSHIP_TIERS[currentIndex + 1];
}

/**
 * Calculate amount needed to reach next tier
 */
export function getAmountToNextTier(totalSpent: number): number {
  const nextTier = getNextTier(totalSpent);
  return nextTier ? Math.max(0, nextTier.min - totalSpent) : 0;
}

/**
 * Get discount percentage for a tier (0 to 1 decimal)
 */
export function getDiscountPercentageByTier(
  tier: LoyaltyTierType,
): number {
  const tierConfig = MEMBERSHIP_TIERS.find((t) => t.key === tier);
  return tierConfig ? tierConfig.discount / 100 : 0;
}

/**
 * Calculate progress percentage to next tier
 */
export function getProgressToNextTier(totalSpent: number): number {
  const currentTier = getTierBySpent(totalSpent);
  const nextTier = getNextTier(totalSpent);

  if (!nextTier) return 100; // Already at max tier

  const tierRange = nextTier.min - currentTier.min;
  const spent = totalSpent - currentTier.min;
  return Math.min((spent / tierRange) * 100, 100);
}

export const LOYALTY_POINTS_MULTIPLIER = 0.1; // 10% of subtotal (base price), regardless of discount or points used
