import { FC, memo } from 'react';

import { ButtonProps, Upload, UploadFile } from 'antd';

import styles from '@components/uploadFile/UploadFileButton/UploadFileButton.module.scss';
import { dummyFileRequest } from '@components/uploadFile/helpers';

import { CustomButton } from '@ui/button/Button';
import { ButtonType } from 'antd/es/button/buttonHelpers';

interface Props extends ButtonProps {
  onFileChange: (file: UploadFile) => void;
  label?: string;
  type?: ButtonType;
}

export const UploadFileButton: FC<Props> = memo(
  ({ label, onFileChange, type = 'primary', ...props }) => {
    return (
      <Upload
        showUploadList={false}
        onChange={(info) => {
          if (info.file.status === 'done') {
            onFileChange(info.file);
          }
        }}
        multiple={false}
        className={styles.uploadFile}
        customRequest={dummyFileRequest}
      >
        <CustomButton {...props} type={type}>
          {label || 'Upload File'}
        </CustomButton>
      </Upload>
    );
  },
);
