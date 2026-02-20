import { FC, PropsWithChildren } from 'react';

import { Space } from 'antd';

import classNames from 'classnames';

import styles from './AuthMainWrapper.module.scss';

export enum TopMargin {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}
interface AuthProps extends PropsWithChildren {
  topMargin?: TopMargin;
}

export const AuthMainWrapper: FC<AuthProps> = (props) => {
  const { children, topMargin = TopMargin.Medium } = props;

  return (
    <Space
      direction={'vertical'}
      size={32}
      className={classNames({
        [styles.topMarginSmall]: topMargin === TopMargin.Small,
        [styles.topMarginMedium]: topMargin === TopMargin.Medium,
        [styles.topMarginLarge]: topMargin === TopMargin.Large,
      })}
    >
      {children}
    </Space>
  );
};
