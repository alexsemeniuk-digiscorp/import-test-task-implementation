import {
  cloneElement,
  CSSProperties,
  FC,
  ReactElement,
  ReactNode,
  useState,
} from 'react';

import type { DropdownProps, MenuProps } from 'antd';
import { Button, Dropdown, Space, theme } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

import classNames from 'classnames';

import TitleWithAction, { TitleWithActionProps } from '@ui/title-with-action';

import styles from './index.module.scss';

const { useToken } = theme;

interface Props extends DropdownProps {
  titleProps?: TitleWithActionProps;
  renderContent?: (menu: ReactNode) => ReactNode;
  contentClassName?: string;
  height?: number;
  width?: number;
  withButton?: boolean;
  isButtonFullWidth?: boolean;
  buttonSize?: SizeType;
  withoutHover?: boolean;
  shouldCloseOnClick?: boolean;
  type?: 'text' | 'link' | 'default' | 'primary' | 'dashed' | undefined;
  isLoading?: boolean;
}

const CustomDropdown: FC<Props> = (props) => {
  const { token } = useToken();

  const {
    onOpenChange,
    children,
    renderContent,
    dropdownRender,
    titleProps,
    contentClassName,
    height = 440,
    width = 360,
    withButton = true,
    buttonSize = 'large',
    isButtonFullWidth = false,
    withoutHover,
    menu,
    type = 'text',
    shouldCloseOnClick,
    isLoading,
    ...otherProps
  } = props;

  const [open, setOpen] = useState(false);

  const handleOpenChange: DropdownProps['onOpenChange'] = (flag, info) => {
    setOpen(flag);

    if (onOpenChange) {
      onOpenChange(flag, info);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = () => {
    setOpen(false);
  };

  const contentStyle: CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    width: `${width}px`,
    padding: '20px',
    overflow: 'hidden',
  };

  const menuStyle: CSSProperties = {
    boxShadow: 'none',
    overflow: 'auto',
    maxHeight: `${height - 60}px`,
  };

  return (
    <Dropdown
      onOpenChange={handleOpenChange}
      open={open}
      menu={shouldCloseOnClick ? { ...menu, onClick: handleMenuClick } : menu}
      dropdownRender={
        dropdownRender ||
        ((menu) => {
          const styledMenu = cloneElement(menu as ReactElement, {
            style: menuStyle,
            className: classNames(styles.menu, {
              [styles.hover]: withoutHover,
            }),
          });

          return (
            <Space
              direction={'vertical'}
              style={contentStyle}
              size={16}
              className={contentClassName}
            >
              {titleProps && <TitleWithAction {...titleProps} />}
              {renderContent ? renderContent(styledMenu) : styledMenu}
            </Space>
          );
        })
      }
      {...otherProps}
    >
      {withButton ? (
        <Button
          loading={isLoading}
          type={type}
          size={buttonSize}
          className={styles.button}
          block={isButtonFullWidth}
        >
          {children}
        </Button>
      ) : (
        children
      )}
    </Dropdown>
  );
};

export default CustomDropdown;
