import { FC } from 'react';

import { ConfigProvider, Typography } from 'antd';

interface Props {
  text: string;
}
export const ModuleSubtitle: FC<Props> = ({ text }) => (
  <ConfigProvider
    theme={{
      token: {
        fontSize: 20,
        fontWeightStrong: 500,
      },
    }}
  >
    <Typography.Title level={3}>{text}</Typography.Title>
  </ConfigProvider>
);
