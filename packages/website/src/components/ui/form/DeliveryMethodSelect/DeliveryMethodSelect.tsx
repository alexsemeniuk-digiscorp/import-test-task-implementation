import { FC } from 'react';

import { Select } from 'antd';
import { SelectProps } from 'antd/lib';

import { DeliveryMethod } from '@helpers/enumTypes';
import capitalize from 'lodash/capitalize';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
}

const DeliveryMethodSelect: FC<Props> = ({
  onChange,
  initValue,
  placeholder,
  ...props
}) => {
  const options = Object.values(DeliveryMethod)?.map((source) => ({
    value: source,
    label: capitalize(source.replace('_', ' ')),
  }));

  return (
    <Select
      defaultValue={initValue}
      placeholder={placeholder || 'Please select the source'}
      onChange={onChange}
      options={options}
      {...props}
    />
  );
};

export default DeliveryMethodSelect;
