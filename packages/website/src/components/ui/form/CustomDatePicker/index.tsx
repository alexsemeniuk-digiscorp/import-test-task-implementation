import { useUserSettingsContext } from '@app/UserSettingsProvider';
import { DatePicker as AntDatePicker, DatePickerProps } from 'antd';
import { replace } from 'lodash';
import { FC } from 'react';

export const DatePicker: FC<DatePickerProps> = ({ ...props }) => {
  const { dateFormat, timeFormat } = useUserSettingsContext();

  const formattedDateFormat = replace(dateFormat ?? 'MM_DD_YYYY', /_/g, '/');
  const formattedTimeFormat = timeFormat === 'HH_mm' ? 'HH:mm' : 'hh:mm A';

  return (
    <AntDatePicker
      format={
        props.showTime
          ? `${formattedDateFormat} ${formattedTimeFormat}`
          : formattedDateFormat
      }
      {...props}
    />
  );
};
