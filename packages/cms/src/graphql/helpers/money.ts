export const dollarsToCents = (dollars: number) => {
  return Math.round((dollars ?? 0) * 100);
};

export const centsToDollars = (cents: number) => {
  return cents / 100;
};
