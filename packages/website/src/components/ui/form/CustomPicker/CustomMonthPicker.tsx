import { DatePicker } from '@ui/form';
import { DatePickerProps } from 'antd';
import { FC } from 'react';
import styles from './CustomPicker.module.scss';

export const CustomMonthPicker: FC<DatePickerProps> = ({ ...props }) => {
  return (
    <DatePicker
      style={{ width: '100%', padding: '11px 15px' }}
      picker={'month'}
      format={'MM'}
      popupClassName={styles.customPicker}
      {...props}
    />
  );
};
