import { CloseCircleOutlined } from '@ant-design/icons';
import { AutoComplete } from 'antd';
import { FC, useEffect, useState } from 'react';

export type AutocompleteOption = {
  label: string;
  value: string;
};

interface AutocompleteInputProps {
  options: AutocompleteOption[] | [] | null;
  onChange?: (value: Maybe<string>) => void;
  placeholder?: string;
}

export const AutocompleteInput: FC<AutocompleteInputProps> = ({
  options,
  placeholder,
  onChange,
}) => {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setValue(String(value));
  };

  useEffect(() => {
    if (onChange && value) onChange(value);
  }, [onChange, value]);

  return (
    <AutoComplete
      placeholder={placeholder}
      options={options ?? []}
      onSelect={onChange}
      onChange={handleChange}
      value={value}
      filterOption={(inputValue, option) => {
        if (!option?.value) return false;
        return option.value.toLowerCase().startsWith(inputValue.toLowerCase());
      }}
      allowClear={{
        clearIcon: <CloseCircleOutlined height={24} />,
      }}
    />
  );
};
