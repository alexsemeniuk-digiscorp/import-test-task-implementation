import { FC } from 'react';

import { ConfigProvider } from 'antd';

import classNames from 'classnames';

import { Icon, IconSize, IconType } from '@assets/icon';

import { CustomButton, CustomButtonProps } from '@ui/button/Button';

import styles from './index.module.scss';

type ActionType = 'delete' | 'default';

interface ActionMenuButtonProps extends CustomButtonProps {
  iconType?: IconType;
  actionType?: ActionType;
  iconSize?: IconSize;
}

const buttonProps: CustomButtonProps = {
  type: 'text',
  size: 'large',
  block: true,
  paddingless: true,
};

const ActionMenuButton: FC<ActionMenuButtonProps> = ({
  iconType,
  actionType = 'default',
  iconSize = IconSize.Medium,
  ...props
}) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          contentFontSizeLG: 14,
          controlHeightLG: 24,
          textHoverBg: 'transparent',
        },
      },
    }}
  >
    <CustomButton
      size={'large'}
      icon={iconType ? <Icon type={iconType} size={iconSize} /> : undefined}
      className={classNames(styles.button, {
        [styles.delete]: actionType === 'delete',
      })}
      {...props}
      {...buttonProps}
    />
  </ConfigProvider>
);
export default ActionMenuButton;
