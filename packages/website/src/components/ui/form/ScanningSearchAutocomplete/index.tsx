import { FC, useCallback, useEffect, useState } from 'react';

import { CloseCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Flex, InputProps, Typography } from 'antd';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

export interface ScanningHandlers {
  clearInput: () => void;
}

interface Props extends InputProps {
  title?: string;
  options: { label: string; value: string }[];
  onInputChange?: (value: string) => void;
  setParentHandlers?: (handlers: ScanningHandlers) => void;
}

const { Text } = Typography;

export const ScanningSearchAutocomplete: FC<Props> = ({
  title = 'Start scanning',
  placeholder = 'Enter code',
  options = [],
  onInputChange,
  setParentHandlers,
}) => {
  const message = useStatusMessage();
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (inputValue: string) => {
      setValue(inputValue);
      if (inputValue.length > 2) {
        if (
          options.filter((opt) => opt.value.includes(inputValue)).length ===
            1 &&
          onInputChange
        ) {
          onInputChange(inputValue);
        }

        if (options?.every((opt) => !opt.value.includes(inputValue))) {
          message.open(
            'error',
            `${inputValue} does not exist at inventory audit`,
          );
        }
      }
    },
    [onInputChange, message, options],
  );

  const clearInput = useCallback(() => setValue(''), [setValue]);

  useEffect(() => {
    if (setParentHandlers) {
      setParentHandlers({ clearInput });
    }
  }, [setParentHandlers, clearInput]);

  return (
    <Flex vertical gap={6} id={'scanningSearch'}>
      <Text style={{ color: '#747679' }}>{title}</Text>
      <AutoComplete
        placeholder={placeholder}
        options={options}
        onChange={handleChange}
        value={value}
        filterOption={(inputValue, option) => {
          if (!option?.value) return false;
          return option.value.startsWith(inputValue);
        }}
        allowClear={{
          clearIcon: <CloseCircleOutlined height={24} />,
        }}
      />
    </Flex>
  );
};
