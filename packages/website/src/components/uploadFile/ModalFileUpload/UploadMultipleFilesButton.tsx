import { FC, memo } from 'react';

import { ButtonProps, Upload, UploadFile, UploadProps } from 'antd';

import styles from '@components/uploadFile/UploadFileButton/UploadFileButton.module.scss';
import { dummyFileRequest } from '@components/uploadFile/helpers';

import { CustomButton } from '@ui/button/Button';
import { ButtonType } from 'antd/es/button/buttonHelpers';
import { UploadChangeParam } from 'antd/es/upload';

interface Props extends ButtonProps {
  onFileChange:
    | ((info: UploadChangeParam<UploadFile<any>>) => void)
    | undefined;
  label?: string;
  type?: ButtonType;
  fileList: UploadFile[];
  dummyRequest: UploadProps['customRequest'];
  acceptFileType?: string;
}

export const UploadMultipleFilesButton: FC<Props> = memo(
  ({
    label,
    onFileChange,
    fileList,
    type = 'primary',
    dummyRequest,
    acceptFileType = 'image/*',
    ...props
  }) => {
    return (
      <Upload
        showUploadList={false}
        onChange={onFileChange}
        multiple={true}
        className={styles.uploadFile}
        fileList={fileList}
        customRequest={dummyFileRequest}
        accept={acceptFileType}
      >
        <CustomButton {...props} type={type}>
          {label || 'Upload File'}
        </CustomButton>
      </Upload>
    );
  },
);
