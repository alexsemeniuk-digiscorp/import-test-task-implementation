import { Select } from 'antd';
import { FC } from 'react';

interface BooleanSelectProps {
  value?: boolean;
  onChange?: (value: boolean | undefined) => void;
  placeholder?: string;
  yesLabel?: string;
  noLabel?: string;
}

export const BooleanSelect: FC<BooleanSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select value',
  yesLabel = 'Yes',
  noLabel = 'No',
}) => {
  const options = [
    { label: yesLabel, value: true },
    { label: noLabel, value: false },
  ];

  return (
    <Select
      allowClear
      value={value}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
    />
  );
};
