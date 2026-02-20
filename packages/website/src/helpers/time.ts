export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY;
export const YEAR = 365 * DAY;

export const CUSTOM_CREATION_FIELD = 'customCreationDate';

export type TimePeriod = 'hour' | 'day' | 'week' | 'month' | 'year';

export const TIME_PERIODS: TimePeriod[] = [
  'hour',
  'day',
  'week',
  'month',
  'year',
];

export const TIME_PERIOD_MAP: Record<TimePeriod, number> = {
  hour: HOUR,
  day: DAY,
  week: WEEK,
  month: MONTH,
  year: YEAR,
};

export const getRentPeriod = (
  // Will be needed to count rental period
  start: Date | number,
  end: Date | number,
  period: EnumRentabledataPeriod,
): number => {
  const periodValue = TIME_PERIOD_MAP[period];

  return (new Date(end).getTime() - new Date(start).getTime()) / periodValue;
};
