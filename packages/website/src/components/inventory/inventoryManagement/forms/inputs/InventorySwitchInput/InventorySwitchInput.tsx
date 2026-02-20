import { FC, useCallback, useEffect, useState } from 'react';

import { Space, Switch, Typography } from 'antd';

export interface Props {
  onChange: (value: boolean) => void;
  value?: boolean;
  defaultChecked?: boolean;
  title: string;
  description?: string;
  disabled?: boolean;
}

export const InventorySwitchInput: FC<Props> = ({
  onChange,
  title,
  description,
  value,
  defaultChecked,
  disabled,
}) => {
  const [checked, setChecked] = useState<boolean>(
    Boolean(defaultChecked || value || disabled),
  );

  const handleChange = useCallback(
    (value: boolean) => {
      setChecked(value);
      onChange(value);
    },
    [onChange],
  );

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setChecked(value);
    }
  }, [value]);

  return (
    <Space size={16} align={'start'}>
      <Switch onChange={handleChange} checked={checked} disabled={disabled} />
      <Space direction={'vertical'} size={12}>
        <Typography.Text strong>{title}</Typography.Text>
        <Typography.Text type={'secondary'}>{description}</Typography.Text>
      </Space>
    </Space>
  );
};
