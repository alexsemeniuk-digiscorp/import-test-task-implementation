import { ConfigProvider, Typography } from 'antd';

import { CustomButton } from '@/components/ui/button/Button';
import { CustomSpace } from '@/components/ui/space';
import { ErrorProps } from '@components/errorPage/types';
import { FC } from 'react';

const ErrorPage: FC<ErrorProps> = ({
  header = '404',
  message = 'Page Not Found',
  backText = 'Back to the Homepage',
  backPath = '/',
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSizeHeading1: 88,
          fontSizeHeading2: 32,
          colorSuccess: '#B0B0B1',
          colorWarning: '#9E9EA8',
        },
        components: {
          Button: {
            contentFontSizeLG: 16,
          },
        },
      }}
    >
      <CustomSpace
        align={'center'}
        direction={'vertical'}
        style={{ width: '100%', marginTop: '30vh' }}
      >
        <Typography.Title type={'success'}>{header}</Typography.Title>
        <Typography.Title type={'warning'} level={2}>
          {message}
        </Typography.Title>
        <CustomButton
          size={'large'}
          href={backPath}
          style={{
            marginTop: 20,
          }}
        >
          {backText}
        </CustomButton>
      </CustomSpace>
    </ConfigProvider>
  );
};

export default ErrorPage;
