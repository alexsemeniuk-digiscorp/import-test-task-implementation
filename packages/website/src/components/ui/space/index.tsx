import { FC } from 'react';

import { Space, SpaceProps } from 'antd';

import classNames from 'classnames';

import styles from './index.module.scss';

interface Props extends SpaceProps {
  block?: boolean;
}

export const CustomSpace: FC<Props> = ({
  block = false,
  className,
  ...props
}) => {
  return (
    <Space
      className={classNames(className, {
        [styles.block]: block,
      })}
      {...props}
    />
  );
};
