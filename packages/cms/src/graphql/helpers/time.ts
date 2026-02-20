import { WEEK } from '../constants/time';

const getPreviousWeekMonday = () => {
  const today = new Date();

  const previousMonday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() - 6,
  );

  return new Date(previousMonday.setHours(0, 0, 0, 0));
};

export const getPreviousWeekRange = () => {
  const monday = getPreviousWeekMonday();

  return {
    startDate: monday,
    endDate: new Date(monday.getTime() + WEEK),
  };
};

export const getMinutesInFuture = (minutes: number): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.getTime().toString();
};

export const isTimeExpired = (time: number): boolean => {
  const now = new Date().getTime();
  return now > time;
};
