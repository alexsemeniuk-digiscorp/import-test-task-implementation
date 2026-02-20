import { FC } from 'react';

import { ConfigProvider, Space, Switch, SwitchProps, Typography } from 'antd';

import { useToken } from '@hooks/useToken';

interface Props extends SwitchProps {
  label: string;
  labelSize?: number;
  reversed?: boolean;
}

const CustomSwitch: FC<Props> = ({
  label,
  labelSize,
  reversed = false,
  ...props
}) => {
  const { token } = useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: labelSize ?? 16,
          colorText: token.colorTextSecondary,
        },
      }}
    >
      <Space size={14}>
        {reversed && label && (
          <Typography.Text style={{ fontSize: labelSize }}>
            {label}
          </Typography.Text>
        )}
        <Switch {...props} checked={props.checked} />
        {!reversed && label && (
          <Typography.Text style={{ fontSize: labelSize }}>
            {label}
          </Typography.Text>
        )}
      </Space>
    </ConfigProvider>
  );
};

export default CustomSwitch;
