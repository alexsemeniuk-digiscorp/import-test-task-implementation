import { CSSProperties, FC } from 'react';

import { Space, Typography, Upload, UploadFile, UploadProps } from 'antd';

import styles from '@components/uploadFile/UploadFileDnD/UploadFileDnD.module.scss';
import { dummyFileRequest } from '@components/uploadFile/helpers';

import { Icon } from '@assets/icon';

import { CustomButton } from '@ui/button/Button';

const { Dragger } = Upload;
interface Props extends UploadProps {
  onFileChange: (file: UploadFile) => void;
  beforeFileUpload?: (file: UploadFile) => boolean;
  style?: CSSProperties;
}
export const UploadFileDnD: FC<Props> = ({
  onFileChange,
  children,
  openFileDialogOnClick,
  beforeFileUpload,
  style,
}) => (
  <Dragger
    onChange={(info) => {
      onFileChange?.(info.file);
    }}
    customRequest={dummyFileRequest}
    multiple={false}
    showUploadList={false}
    className={styles.uploadDrag}
    openFileDialogOnClick={openFileDialogOnClick}
    beforeUpload={beforeFileUpload}
    style={style}
  >
    {children ? (
      children
    ) : (
      <Space direction={'vertical'} size={16} className={styles.centeredSpace}>
        <Icon type={'upload'} />
        <Typography.Text type={'secondary'}>
          Drag and drop file here
        </Typography.Text>
        <Typography.Text type={'secondary'}>or</Typography.Text>
        <CustomButton type={'primary'}>{'Click to browse'}</CustomButton>
      </Space>
    )}
  </Dragger>
);
