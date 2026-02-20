import { Radio, RadioChangeEvent, RadioGroupProps } from 'antd';
import { FC } from 'react';

const timeFormatOptions = [
  {
    key: '12-hour',
    label: '12-hour',
    value: 'hh_mm_A',
  },
  {
    key: '24-hour',
    label: '24-hour',
    value: 'HH_mm',
  },
];

interface Props extends RadioGroupProps {
  initialValue: EnumLocalizationsettingTimeformat | undefined;
  onChange: (value: RadioChangeEvent) => void;
}

export const TimeFormatRadioGroup: FC<Props> = ({ initialValue, onChange }) => {
  const handleChange = (event: RadioChangeEvent) => {
    onChange?.(event.target.value);
  };

  return (
    <Radio.Group
      onChange={handleChange}
      options={timeFormatOptions}
      defaultValue={initialValue}
    />
  );
};
