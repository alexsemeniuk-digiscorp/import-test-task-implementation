import { FC, memo, PropsWithChildren } from 'react';

import { Grid, Layout } from 'antd';

import { CustomSpace } from '@ui/space';

export const InventoryFormLayout: FC<PropsWithChildren> = memo(
  ({ children }) => {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    return (
      <Layout
        style={{
          padding: isMobile ? 12 : 32,
          background: '#FFF',
          minHeight: '100%',
          position: 'relative',
        }}
      >
        <CustomSpace direction={'vertical'} block size={32}>
          {children}
        </CustomSpace>
      </Layout>
    );
  },
);
