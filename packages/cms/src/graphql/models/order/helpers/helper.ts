export const centsToDollars = (cents: number) => {
  return cents / 100;
};
export const dollarsToCents = (dollars: number) => {
  return Math.round((dollars ?? 0) * 100);
};

export const calculateApplicationFee = (
  summary: number,
  applicationFee: number,
): number => {
  return Math.round(summary * 100 * (applicationFee / 100));
};

export const calculateApplicationFeeForYen = (
  summary: number,
  applicationFee: number,
): number => {
  return Math.round(summary * (applicationFee / 100));
};
