export const roundPoints = (value: number, precision = 2): number => {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
};
