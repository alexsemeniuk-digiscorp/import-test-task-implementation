import { FC } from 'react';

import { Select, SelectProps } from 'antd';

interface Props extends SelectProps {
  initValue?: string;
}
export const ReminderSelect: FC<Props> = ({ initValue, ...props }) => {
  return (
    <Select
      defaultValue={initValue ?? undefined}
      placeholder={'Pick the value'}
      options={[
        { value: 'true', label: 'Reminder' },
        { value: 'false', label: 'No Reminder' },
      ]}
      style={{ width: '100%' }}
      {...props}
    />
  );
};
