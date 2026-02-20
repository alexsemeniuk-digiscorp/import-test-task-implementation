import { FC } from 'react';

import { ShoppingOutlined } from '@ant-design/icons';

import CustomAvatar, { AvatarSize } from '@ui/avatar/index';

interface Props {
  src?: string;
  imageSizeMultiplier?: number;
}
export const ProductAvatar: FC<Props> = ({ src, imageSizeMultiplier = 1 }) => (
  <CustomAvatar
    src={src}
    icon={!src && <ShoppingOutlined />}
    size={AvatarSize.Medium}
    imageSizeMultiplier={imageSizeMultiplier}
  />
);
