import { CSSProperties, FC } from 'react';

import { ConfigProvider, Space, Typography } from 'antd';

import { Icon, IconSize, IconType } from '@assets/icon';

interface Props {
  type: IconType;
  text: string;
  spaceSize?: number;
  fontSize?: number;
  iconColor?: string;
  iconSize?: IconSize;
  isCopyable?: boolean;
  onClick?: () => void;
  styles?: CSSProperties;
}

const TextWithIcon: FC<Props> = ({
  text,
  type,
  spaceSize = 6,
  fontSize = 12,
  iconColor = '#959595',
  iconSize = IconSize.Tiny,
  isCopyable,
  onClick,
  styles,
}) => (
  <ConfigProvider
    theme={{
      token: {
        fontSize: fontSize,
      },
    }}
  >
    <Space
      styles={{ item: styles ?? {} }}
      onClick={onClick}
      size={spaceSize}
      align={'center'}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <Icon color={iconColor} type={type} size={iconSize} />
      </span>
      <Typography.Text copyable={isCopyable} style={{ whiteSpace: 'nowrap' }}>
        {text}
      </Typography.Text>
    </Space>
  </ConfigProvider>
);

export default TextWithIcon;
