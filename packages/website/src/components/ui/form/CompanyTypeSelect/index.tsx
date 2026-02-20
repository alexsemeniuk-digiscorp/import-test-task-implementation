import { FC } from 'react';

import { Select } from 'antd';
import { SelectProps } from 'antd/lib';

import { CompanyType } from '@helpers/enumTypes';
import capitalize from 'lodash/capitalize';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
}

const CompanyTypeSelect: FC<Props> = ({ onChange, initValue, ...props }) => {
  const options = Object.values(CompanyType)?.map((option) => ({
    value: option,
    label: capitalize(option),
  }));

  return (
    <Select
      defaultValue={initValue}
      placeholder={'Please select the company type'}
      onChange={onChange}
      options={options}
      {...props}
    />
  );
};

export default CompanyTypeSelect;
