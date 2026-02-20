import { CSSProperties, FC } from 'react';

import { ButtonProps, ConfigProvider } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

import { Icon, IconSize, IconType } from '@assets/icon';

import CustomDropdown from '@ui/dropdown';
import { ItemType } from 'antd/es/menu/interface';

interface ActionMenuDropdownProps {
  items: ItemType[];
  buttonSize?: SizeType;
  width?: number;
  iconSize?: IconSize;
  type?: IconType;
  iconStyle?: CSSProperties;
  withButton?: boolean;
  buttonType?: ButtonProps['type'];
  disabled?: boolean;
}

const ActionMenuDropdown: FC<ActionMenuDropdownProps> = ({
  items,
  buttonSize = 'large',
  width,
  iconSize,
  type = 'options-vertical',
  iconStyle,
  buttonType,
  disabled,
}) => (
  <ConfigProvider
    theme={{
      token: {
        colorSplit: '#E7E7E7',
      },
    }}
  >
    <CustomDropdown
      menu={{ items }}
      width={width ? width : 190}
      buttonSize={buttonSize}
      withoutHover
      shouldCloseOnClick
      type={buttonType}
      disabled={disabled}
    >
      <Icon type={type} size={iconSize} styles={iconStyle} />
    </CustomDropdown>
  </ConfigProvider>
);

export default ActionMenuDropdown;
