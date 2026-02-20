import { DatePicker } from '@ui/form';
import { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';
import styles from './CustomPicker.module.scss';

export const CustomDayPicker: FC<DatePickerProps> = ({ ...props }) => {
  return (
    <DatePicker
      style={{ width: '100%', padding: '11px 15px' }}
      picker={'date'}
      defaultPickerValue={dayjs('2024-12-01')}
      format={'DD'}
      popupClassName={styles.customPicker}
      {...props}
    />
  );
};
