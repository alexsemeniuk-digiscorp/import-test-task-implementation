import { Flex, Radio, RadioChangeEvent } from 'antd';
import { FC, useEffect, useState } from 'react';

export const ScannedRadioInput: FC<{
  options: [string, string];
  onChange?: (value: string | number | undefined) => void;
}> = ({ options, onChange }) => {
  const [value, setValue] = useState(options[0]);

  useEffect(() => {
    onChange?.(value);
  }, [onChange, value]);

  const handleChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };

  return (
    <Flex vertical gap={'middle'} style={{ width: '100%', minWidth: '100%' }}>
      <Radio.Group
        defaultValue={options[0]}
        buttonStyle={'solid'}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        <Radio.Button
          style={{
            width: '50%',
            textTransform: 'capitalize',
            textAlign: 'center',
          }}
          value={options[0]}
        >
          {options[0]}
        </Radio.Button>
        <Radio.Button
          style={{
            width: '50%',
            textTransform: 'capitalize',
            textAlign: 'center',
          }}
          value={options[1]}
        >
          {options[1]}
        </Radio.Button>
      </Radio.Group>
    </Flex>
  );
};
