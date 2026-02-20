import { CSSProperties, FC, memo, ReactNode } from 'react';

import { useFileSelect } from '@components/uploadFile/hooks/useFileSelect';
import { UploadFileDnD } from '@components/uploadFile/UploadFileDnD/UploadFileDnD';
import { UploadFile } from 'antd';

import { Icon } from '@assets/icon';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { CustomButton } from '@ui/button/Button';

import styles from './ImageDnD.module.scss';

interface Props {
  onChange?: (file: File | null) => void;
  defaultUrl?: string;
  children?: ReactNode;
  style?: CSSProperties;
  allowedTypes?: string[];
  disallowedTypes?: string[];
  disallowedFileSize?: number;
  editable?: boolean;
}

export const ImageDnD: FC<Props> = memo(
  ({
    onChange,
    defaultUrl,
    children,
    disallowedTypes,
    allowedTypes,
    disallowedFileSize,
    editable = true,
    style,
  }) => {
    const { handleRemoveFile, handleFileChange, fileSrc, file } = useFileSelect(
      {
        onChange,
        defaultUrl,
      },
    );
    const message = useStatusMessage();

    const isValidFileForUpload = (file: UploadFile) => {
      if (disallowedFileSize && file.size) {
        const isFileSizeAllowed = file.size / 1024 / 1024 <= disallowedFileSize;
        if (!isFileSizeAllowed) {
          message.open(
            'error',
            `The image must be smaller than ${disallowedFileSize}MB!`,
          );
          return false;
        }
      }

      if (disallowedTypes) {
        const isValidFile =
          file.type?.startsWith('image/') &&
          !disallowedTypes?.includes(file.type);

        if (!isValidFile) {
          message?.open('error', 'Wrong file format');
        }
        return isValidFile ?? false;
      }
      if (allowedTypes) {
        const isValidFile =
          file.type?.startsWith('image/') && allowedTypes?.includes(file.type);

        if (!isValidFile) {
          message?.open('error', 'Wrong file format');
        }
        return isValidFile ?? false;
      }

      return true;
    };

    return (
      <UploadFileDnD
        onFileChange={handleFileChange}
        openFileDialogOnClick={!fileSrc}
        beforeFileUpload={isValidFileForUpload}
        style={style}
      >
        {fileSrc && (
          <div className={styles.imageContainer}>
            <img
              src={fileSrc}
              alt={file?.fileName}
              className={styles.previewImage}
            />
            {editable && (
              <CustomButton
                type={'text'}
                onClick={handleRemoveFile}
                className={styles.closePreviewButton}
                icon={<Icon type={'close'} />}
              />
            )}
          </div>
        )}
        {!fileSrc && children ? children : null}
      </UploadFileDnD>
    );
  },
);
