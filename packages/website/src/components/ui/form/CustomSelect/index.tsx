import { FC, PropsWithChildren } from 'react';

import { ConfigProvider, Typography } from 'antd';

import { useToken } from '@hooks/useToken';

import { CustomSpace } from '@ui/space';

interface Props extends PropsWithChildren {
  label: string;
  isBlock?: boolean;
}
export const CustomLabel: FC<Props> = ({
  label,
  isBlock = true,
  children,
  ...props
}) => {
  const { token } = useToken();

  return (
    <CustomSpace direction={'vertical'} size={4} block={isBlock} {...props}>
      <ConfigProvider
        theme={{
          token: {
            colorText: token.colorTextSecondary,
            fontSize: 12,
            lineHeight: 1.2,
          },
        }}
      >
        <Typography.Text>{label}</Typography.Text>
      </ConfigProvider>
      {children}
    </CustomSpace>
  );
};
