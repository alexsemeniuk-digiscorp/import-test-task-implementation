import { FC, MouseEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  ButtonProps,
  Modal,
  ModalFuncProps,
  Tooltip,
  TooltipProps,
} from 'antd';

import classNames from 'classnames';

import styles from './Button.module.scss';

const { confirm } = Modal;

export interface CustomButtonProps extends ButtonProps {
  iconPosition?: 'start' | 'end';
  paddingless?: boolean;
  isCircle?: boolean;
  absoluteHref?: string;
  noGap?: boolean;
  confirmProps?: ModalFuncProps;
  success?: boolean;
  noHover?: boolean;
  tooltipProps?: TooltipProps;
}

export const CustomButton: FC<CustomButtonProps> = (props) => {
  const {
    iconPosition = 'start',
    icon,
    children,
    href,
    absoluteHref,
    paddingless,
    isCircle,
    type,
    className,
    style,
    onClick,
    confirmProps,
    noGap,
    success,
    tooltipProps,
    ...otherProps
  } = props;

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (confirmProps) {
        e.preventDefault();
        e.stopPropagation();
        confirm(confirmProps);
      }

      if (onClick) {
        e.stopPropagation();
        onClick(e);
      }
    },
    [onClick, confirmProps],
  );

  const buttonComponent = (
    <Tooltip {...tooltipProps}>
      <Button
        className={classNames(styles.button, className, {
          [styles.noHover]: props.noHover,
          [styles.buttonIconLeft]: iconPosition === 'start',
          [styles.buttonIconRight]: iconPosition === 'end',
          [styles.paddingless]: paddingless,
          [styles.text]: type === 'text',
          [styles.primary]: type === 'primary',
          [styles.success]: success,
          [styles.circle]: isCircle,
          [styles.noGap]: noGap,
        })}
        type={type}
        style={{
          ...style,
          padding: paddingless ? 0 : undefined,
        }}
        href={absoluteHref}
        onClick={onClick || confirmProps ? handleClick : undefined}
        {...otherProps}
      >
        {icon}
        {children}
      </Button>
    </Tooltip>
  );

  return href ? <Link to={href}>{buttonComponent}</Link> : buttonComponent;
};
