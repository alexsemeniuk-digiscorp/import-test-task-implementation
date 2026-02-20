import { FC, useEffect, useState } from 'react';

import {
  Modal,
  Space,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { RcFile } from 'antd/es/upload';

import {
  dummyFileRequest,
  getFileSrc,
  getMaxAttachmentsCount,
} from '@components/uploadFile/helpers';

import { Icon } from '@assets/icon';

import styles from './UploadImageList.module.scss';

interface Props extends UploadProps {
  onFilesChange: (files: UploadFile[]) => void;
  initialValues?: UploadFile[];
  maxCount?: number;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  acceptFormat?: string;
}

export const UploadImageList: FC<Props> = ({
  onRemove,
  onFilesChange,
  initialValues,
  maxCount = 6,
  acceptFormat = 'image/*',
  ...otherProps
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>(initialValues || []);

  const handleCancel = () => setPreviewOpen(false);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onFilesChange(newFileList);
  };

  useEffect(() => {
    if (initialValues) {
      setFileList(initialValues);
    }
  }, [initialValues, setFileList]);

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getFileSrc(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };

  const imagesLimit = getMaxAttachmentsCount(maxCount);

  const uploadButton = (
    <Space direction={'vertical'} size={8} className={styles.centeredSpace}>
      <Icon type={'upload'} />
      <Typography.Text type={'secondary'}>
        Drag and drop {imagesLimit && `max ${imagesLimit} files here`}
      </Typography.Text>
      <Typography.Text type={'secondary'}>or</Typography.Text>
      <Typography.Text type={'secondary'}>Click to Browse</Typography.Text>
    </Space>
  );

  return (
    <>
      <Upload
        {...otherProps}
        listType={'picture-card'}
        fileList={fileList}
        onPreview={onPreview}
        onChange={handleChange}
        customRequest={dummyFileRequest}
        className={styles.uploadImageList}
        maxCount={imagesLimit}
        multiple={true}
        accept={acceptFormat}
        onRemove={onRemove}
      >
        {imagesLimit && fileList.length >= imagesLimit ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
