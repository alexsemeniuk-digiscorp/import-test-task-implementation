import { FC, memo } from 'react';

import { ConfigProvider, Space, Typography } from 'antd';

import { RemoveUploadFileButton } from '@components/uploadFile/RemoveUploadFileButton';
import { UploadFileButton } from '@components/uploadFile/UploadFileButton/UploadFileButton';
import { useFileSelect } from '@components/uploadFile/hooks/useFileSelect';

import { useToken } from '@hooks/useToken';

import CustomAvatar, { AvatarSize } from '@ui/avatar';

interface Props {
  onChange: (file: File | null) => void;
  defaultUrl?: string;
  uploadButtonText?: string;
  removeButtonText?: string;
}

export const AvatarInput: FC<Props> = memo(
  ({ onChange, defaultUrl, uploadButtonText, removeButtonText }) => {
    const { token } = useToken();

    const { handleRemoveFile, handleFileChange, fileSrc, file } = useFileSelect(
      {
        onChange,
        defaultUrl,
      },
    );

    return (
      <Space size={16}>
        <CustomAvatar src={fileSrc} size={AvatarSize.Big} />
        <Space direction={'vertical'} size={16}>
          <ConfigProvider
            theme={{
              token: {
                colorText: token.colorTextSecondary,
              },
            }}
          >
            <Typography.Text> Profile photo</Typography.Text>
          </ConfigProvider>
          <Space size={16}>
            <UploadFileButton
              onFileChange={handleFileChange}
              label={uploadButtonText}
            />
            <RemoveUploadFileButton
              label={removeButtonText}
              onRemove={handleRemoveFile}
              disabled={!file && !defaultUrl}
            />
          </Space>
        </Space>
      </Space>
    );
  },
);
