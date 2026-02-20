import { FC } from 'react';

import defaultItemImage from '@assets/images/item-default.svg';
import styles from '@ui/avatar/AvatarWithPreview.module.scss';
import { CustomPreviewEyeMask } from '@ui/avatar/CustomPreviewEyeMask';
import { Image } from 'antd';

interface Props {
  src?: string;
  alt?: string;
  fallbackImage?: string;
  width?: number;
  height?: number;
}
export const AvatarWithPreview: FC<Props> = ({
  src,
  alt = 'image',
  fallbackImage = defaultItemImage,
  width = 32,
  height = 32,
  ...props
}) => (
  <Image
    className={styles.img}
    width={width}
    height={height}
    src={src || fallbackImage}
    alt={alt}
    preview={{
      mask: <CustomPreviewEyeMask />,
    }}
    {...props}
  />
);
