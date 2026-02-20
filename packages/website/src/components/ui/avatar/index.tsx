import { FC, JSX } from 'react';

import { Avatar, AvatarProps } from 'antd';

import { UserOutlined } from '@ant-design/icons';

export enum AvatarSize {
  Small = 20,
  Medium = 36,
  Large = 40,
  Big = 64,
}

interface Props extends AvatarProps {
  size?: AvatarSize | number;
  defaultIcon?: JSX.Element;
  imageSizeMultiplier?: number;
}

const CustomAvatar: FC<Props> = ({
  src,
  alt,
  size,
  defaultIcon,
  imageSizeMultiplier = 1,
  ...otherProps
}) => {
  const altText = alt || 'avatar';
  const imageSize = size ?? AvatarSize.Medium;

  return (
    <>
      <Avatar
        size={Number((imageSize * imageSizeMultiplier).toFixed(2))}
        src={src || undefined}
        icon={defaultIcon ?? <UserOutlined />}
        alt={altText}
        {...otherProps}
      />
    </>
  );
};

export default CustomAvatar;
