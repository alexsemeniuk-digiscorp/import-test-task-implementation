import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { replace } from 'lodash';

dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;

export const formatDateAndTime = (
  inputDate?: string | Date | number | null | undefined,
  dateFormat?: string | null | undefined,
  timeFormat?: string | null | undefined,
  withTime?: boolean,
  customDateFormat?: string | undefined,
): string => {
  const formattedDateFormat = replace(dateFormat ?? 'MM_DD_YYYY', /_/g, '/');
  const formattedTimeFormat = timeFormat === 'HH_mm' ? 'HH:mm' : 'hh:mm A';

  if (!inputDate) {
    return '-';
  }

  const dateTimeFormat = withTime
    ? `${customDateFormat ?? formattedDateFormat} ${formattedTimeFormat}`
    : customDateFormat ?? formattedDateFormat;

  return inputDate === 'nowDate'
    ? dayjs().tz().format(dateTimeFormat)
    : dayjs(inputDate).tz().format(dateTimeFormat);
};
