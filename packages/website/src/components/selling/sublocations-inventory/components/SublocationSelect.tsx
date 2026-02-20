import { FC, useEffect, useState } from 'react';

import { Select, SelectProps } from 'antd';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  defaultValue?: { label: string; value: string };
  options?: { label: string; value: string }[];
  disabled?: boolean;
}

export const SublocationSelect: FC<Props> = ({
  defaultValue = { label: 'Unallocated', value: '' },
  options = [],
  disabled = false,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = (value: string) => {
    setValue(value);
    onChange?.(value ? value : defaultValue?.value);
  };

  useEffect(() => {
    if (!value) {
      onChange?.(defaultValue?.value);
    }
  }, [onChange, value, defaultValue]);

  return (
    <Select
      defaultValue={defaultValue.label}
      disabled={disabled}
      options={options}
      onChange={handleChange}
      {...props}
    />
  );
};
