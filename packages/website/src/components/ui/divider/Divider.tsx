import { FC } from 'react';

import { ConfigProvider, Divider, DividerProps } from 'antd';

interface Props extends DividerProps {
  margin?: number;
}

export const CustomDivider: FC<Props> = ({ margin, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          margin: 24,
          marginLG: margin ?? 24,
          colorText: '#B0B0B1',
        },
      }}
    >
      <Divider {...props} />
    </ConfigProvider>
  );
};
