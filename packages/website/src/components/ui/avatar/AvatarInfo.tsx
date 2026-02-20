import { FC, PropsWithChildren } from 'react';

import { Flex, Space } from 'antd';

import { AvatarWithPreview } from '@ui/avatar/AvatarWithPreview';
import { ProductAvatar } from '@ui/avatar/ProductAvatar';
import CustomAvatar, { AvatarSize } from '@ui/avatar/index';
import TextInfoBlock, { TextInfoBlockType } from '@ui/text-info-block';

export interface AvatarInfoProps extends TextInfoBlockType, PropsWithChildren {
  avatarSize?: number;
  src?: string;
  alt?: string;
  isProduct?: boolean;
  isCalendar?: boolean;
  showImage?: boolean;
  descriptionColor?: string;
  alignAvatar?: 'center' | 'start' | 'end';
  fontWeight?: number;
  ellipsis?: boolean;
  preview?: boolean;
  imageSizeMultiplier?: number;
}
const AvatarInfo: FC<AvatarInfoProps> = ({
  src,
  alt,
  title,
  description,
  isProduct,
  descriptionColor,
  titleFontSize,
  children,
  alignAvatar,
  avatarSize,
  showImage = true,
  fontWeight,
  ellipsis = false,
  preview = false,
  imageSizeMultiplier = 1,
}) => (
  <Space size={12} align={alignAvatar}>
    {showImage &&
      (isProduct ? (
        preview ? (
          <AvatarWithPreview src={src} />
        ) : (
          <ProductAvatar src={src} imageSizeMultiplier={imageSizeMultiplier} />
        )
      ) : (
        <CustomAvatar
          src={src}
          size={avatarSize ?? AvatarSize.Large}
          alt={alt}
          imageSizeMultiplier={imageSizeMultiplier}
        />
      ))}
    <Flex vertical gap={12}>
      <TextInfoBlock
        ellipsis={ellipsis}
        title={title}
        description={description}
        titleFontSize={titleFontSize ? titleFontSize : isProduct ? 14 : 12}
        fontWeight={fontWeight}
        descriptionColor={descriptionColor}
      />
      {children}
    </Flex>
  </Space>
);

export default AvatarInfo;
