import dayjs from '@/dayjsConfig';
import { RangePickerProps } from 'antd/es/date-picker';

export const DEFAULT_MEMO_DAYS = 1000;

const monthMap: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

export const disabledPastDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().tz().startOf('day');
};

export const disabledFutureDate: RangePickerProps['disabledDate'] = (
  current,
) => {
  return current && current > dayjs().tz().startOf('day');
};

export const currentDate = new Date();

export const lastMonthSameDay = new Date(
  Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth() - 1,
    currentDate.getUTCDate(),
  ),
);

export const lastYearSameDay = new Date(
  Date.UTC(
    currentDate.getUTCFullYear() - 1,
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
  ),
);

export const beginningOfToday = new Date(
  Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
  ),
);

export const beginningOfTomorrow = new Date(
  Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate() + 1,
  ),
);

export const beginningOfThisMonth = new Date(
  Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1),
);

export const beginningOfLastMonth = new Date(
  Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1),
);

export const beginningOfThisYear = new Date(
  Date.UTC(currentDate.getUTCFullYear(), 0, 1),
);

export const beginningOfLastYear = new Date(
  Date.UTC(currentDate.getUTCFullYear() - 1, 0, 1),
);

export const getTodayDateRange = () => {
  return {
    between: [
      beginningOfToday.toISOString(),
      beginningOfTomorrow.toISOString(),
    ],
  };
};

export const getDateRange = (year: Maybe<string>, month: Maybe<string>) => {
  let startDate, endDate;

  if (year && month) {
    const numericMonth = monthMap[month];
    startDate = new Date(`${year}-${numericMonth}-01`);
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (year) {
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${parseInt(year) + 1}-01-01`);
  } else {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear() + 1, 0, 1);
  }

  return {
    between: [startDate.toISOString(), endDate.toISOString()],
  };
};

export const addDaysToDate = (
  date: Maybe<Date | string>,
  days: Maybe<number>,
) => {
  if (date && days) {
    const initialDate = new Date(date);
    const daysAmount = Number(days);

    return initialDate.setDate(initialDate.getDate() + daysAmount);
  } else {
    return date;
  }
};

export const addDaysToDateAsDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

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
