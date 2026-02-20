import { FC } from 'react';

import { Select } from 'antd';
import { SelectProps } from 'antd/lib';

import { ActivityType } from '@helpers/enumTypes';
import capitalize from 'lodash/capitalize';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
}

export const ActivityTypeSelect: FC<Props> = ({
  onChange,
  initValue,
  ...props
}) => {
  const options = Object.values(ActivityType).map((type) => ({
    value: type,
    label: capitalize(type.split('_').join(' ')),
  }));
  return (
    <Select
      defaultValue={initValue}
      placeholder={'Please select activity type'}
      onChange={onChange}
      options={options}
      {...props}
    />
  );
};
