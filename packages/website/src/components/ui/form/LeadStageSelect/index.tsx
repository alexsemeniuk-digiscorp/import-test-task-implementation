import { FC } from 'react';

import { Select } from 'antd';
import { SelectProps } from 'antd/lib';

import { LeadStage } from '@helpers/enumTypes';
import capitalize from 'lodash/capitalize';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
}

const LeadStageSelect: FC<Props> = ({
  onChange,
  initValue,
  placeholder,
  ...props
}) => {
  const options = Object.values(LeadStage)?.map((stage) => ({
    value: stage,
    label: capitalize(stage),
  }));

  return (
    <Select
      defaultValue={initValue}
      placeholder={placeholder || 'Please select current stage'}
      onChange={onChange}
      options={options}
      allowClear
      {...props}
    />
  );
};

export default LeadStageSelect;
