import { FC } from 'react';

import { ConfigProvider } from 'antd';
import { CheckboxProps } from 'antd/lib';
import Checkbox from 'antd/lib/checkbox/Checkbox';

import { useToken } from '@hooks/useToken';

import TextInfoBlock, { TextInfoBlockType } from '@ui/text-info-block';

import styles from './index.module.scss';

interface Props extends CheckboxProps {
  label: TextInfoBlockType;
}

const CheckboxCircle: FC<Props> = ({ label, ...props }) => {
  const { token } = useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: token.colorPrimary,
        },
      }}
    >
      <Checkbox {...props} className={styles.checkbox}>
        <TextInfoBlock {...label} />
      </Checkbox>
    </ConfigProvider>
  );
};

export default CheckboxCircle;
