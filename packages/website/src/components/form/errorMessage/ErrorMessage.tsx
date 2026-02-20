import { FC } from 'react';

import { ConfigProvider, Typography } from 'antd';
import { BaseType } from 'antd/es/typography/Base';

interface InputMessageProps {
  message: string;
  type: BaseType;
}

export const InputMessage: FC<InputMessageProps> = ({ message, type }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 10,
        },
      }}
    >
      <div
        style={{
          paddingTop: 4,
        }}
      >
        <Typography.Text type={type}>{message}</Typography.Text>
      </div>
    </ConfigProvider>
  );
};
