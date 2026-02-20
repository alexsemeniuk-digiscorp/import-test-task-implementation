export const DEFAULT_MEMO_DAYS = 1000;

export const getDaysDifference = (
  pastDate?: Date | string | null,
  futureDate?: Date | string | null,
): number | null => {
  if (!pastDate || !futureDate) return null;

  const past = new Date(pastDate);
  const future = new Date(futureDate);

  if (isNaN(past.getTime()) || isNaN(future.getTime())) {
    return null;
  }

  const diffTime = future.getTime() - past.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const addDaysToDateAsDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
