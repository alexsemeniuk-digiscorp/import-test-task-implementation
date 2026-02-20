import { FC } from 'react';

import { ConfigProvider, Row, RowProps, Typography } from 'antd';

import { useToken } from '@hooks/useToken';

import styles from './FormLabel.module.scss';

interface FormLabelProps extends RowProps {
  label: string;
  link?: string;
  linkText?: string;
}

export const FormLabel: FC<FormLabelProps> = ({
  label,
  link,
  linkText,
  ...props
}) => {
  const { token } = useToken();
  return (
    <Row
      justify={'space-between'}
      className={styles.container}
      align={'stretch'}
      {...props}
    >
      <ConfigProvider
        theme={{
          token: {
            fontSize: 12,
            colorText: token.colorTextSecondary,
          },
        }}
      >
        <Typography.Text>{label}</Typography.Text>
        {link && linkText && (
          <ConfigProvider
            theme={{
              token: {
                fontSize: 10,
                lineHeight: 1.6,
              },
            }}
          >
            <Typography.Link href={link} className={styles.link}>
              {linkText}
            </Typography.Link>
          </ConfigProvider>
        )}
      </ConfigProvider>
    </Row>
  );
};
