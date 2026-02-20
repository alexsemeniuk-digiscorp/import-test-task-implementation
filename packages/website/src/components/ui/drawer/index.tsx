import { FC, PropsWithChildren } from 'react';

import { ConfigProvider, Drawer, DrawerProps } from 'antd';

import { useToken } from '@hooks/useToken';

import module from './index.module.scss';

const CustomDrawer: FC<PropsWithChildren & DrawerProps> = ({
  children,
  width = 444,
  styles,
  ...props
}) => {
  const { token } = useToken();
  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 20,
          paddingLG: 32,
          fontSizeLG: 24,
        },
      }}
    >
      <Drawer
        forceRender
        width={width}
        className={module.drawer}
        styles={{
          header: {
            position: 'relative',
            color: token.colorTextHeading,
            paddingTop: '64px',
            ...styles?.header,
          },
          body: {
            ...styles?.body,
          },
        }}
        {...props}
      >
        {children}
      </Drawer>
    </ConfigProvider>
  );
};

export default CustomDrawer;
