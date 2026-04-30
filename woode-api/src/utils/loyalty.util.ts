export function calculateLoyaltyTier(
  totalSpent: number,
): 'NORMAL' | 'SILVER' | 'GOLD' | 'PLATINUM' {
  if (totalSpent >= 200000000) return 'PLATINUM';
  if (totalSpent >= 50000000) return 'GOLD';
  if (totalSpent >= 10000000) return 'SILVER';
  return 'NORMAL';
}

export function calculateEarnedPoints(total: number): number {
  // 10% giá hóa đơn thành điểm
  return Math.floor(total * 0.1);
}

export function getDiscountPercentageByTier(
  totalSpent: number,
): number {
  // PLATINUM: giảm 10%
  if (totalSpent >= 200000000) return 0.1;
  // GOLD: giảm 5%
  if (totalSpent >= 50000000) return 0.05;
  // SILVER, NORMAL: không giảm
  return 0;
}

export function getMonthlyResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
}
