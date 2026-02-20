import { Radio, RadioChangeEvent, RadioGroupProps } from 'antd';
import { FC } from 'react';

const dateFormatOptions = [
  {
    key: 'MDY',
    label: 'MM/DD/YYYY',
    value: 'MM_DD_YYYY',
  },
  {
    key: 'DMY',
    label: 'DD/MM/YYYY',
    value: 'DD_MM_YYYY',
  },
  {
    key: 'YMD',
    label: 'YYYY/MM/DD',
    value: 'YYYY_MM_DD',
  },
];

interface Props extends RadioGroupProps {
  initialValue: EnumLocalizationsettingDateformat | undefined;
  onChange: (value: RadioChangeEvent) => void;
}

export const DateFormatRadioGroup: FC<Props> = ({ initialValue, onChange }) => {
  const handleChange = (event: RadioChangeEvent) => {
    onChange?.(event.target.value);
  };

  return (
    <Radio.Group
      onChange={handleChange}
      options={dateFormatOptions}
      defaultValue={initialValue}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    />
  );
};
