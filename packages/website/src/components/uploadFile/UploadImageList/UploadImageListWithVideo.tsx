import { FC, ReactElement, useEffect, useState } from 'react';

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
  isFileAllowed,
} from '@components/uploadFile/helpers';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { Icon } from '@assets/icon';
import { UploadFileMask } from '@components/uploadFile/UploadImageList/components/UploadFileMask';
import styles from './UploadImageList.module.scss';

interface Props extends UploadProps {
  onFilesChange: (files: UploadFile[]) => void;
  initialValues?: UploadFile[];
  maxCount?: number;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  acceptFormat?: string;
}

export const UploadImageListWithVideo: FC<Props> = ({
  onRemove,
  onFilesChange,
  initialValues,
  maxCount = 6,
  acceptFormat = 'image/*',
  ...otherProps
}) => {
  const message = useStatusMessage();
  const [fileList, setFileList] = useState<UploadFile[]>(initialValues || []);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileType, setFileType] = useState<string>('image');

  const handleCancel = () => setPreviewOpen(false);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const filteredUploadFiles = newFileList.filter((item) =>
      isFileAllowed(acceptFormat, item?.type),
    );
    setFileList(filteredUploadFiles);
    onFilesChange(filteredUploadFiles);
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
    const type = file?.type?.split('/')[0];
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
    setFileType(String(type));
  };

  const onBeforeUpload = async (
    file: UploadFile,
    _: UploadFile[],
  ): Promise<boolean | void> => {
    if (isFileAllowed(acceptFormat, file?.type)) {
      return true;
    } else {
      message.open(
        'error',
        `The file type "${file?.type}" is not allowed. Please upload only supported formats: ${acceptFormat}.`,
      );
      return Promise.reject();
    }
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

  const renderItems = (_: ReactElement, file: UploadFile) => {
    return (
      <UploadFileMask
        key={file.uid}
        file={file}
        previewTitle={previewTitle}
        onPreview={onPreview}
        onRemove={onRemove}
      />
    );
  };

  return (
    <>
      <Upload
        {...otherProps}
        listType={'picture-card'}
        fileList={fileList}
        onPreview={onPreview}
        onChange={handleChange}
        beforeUpload={onBeforeUpload}
        customRequest={dummyFileRequest}
        className={styles.uploadImageList}
        maxCount={imagesLimit}
        itemRender={renderItems}
        accept={acceptFormat}
        multiple={true}
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
        {fileType === 'image' && (
          <img
            alt={previewTitle}
            style={{ width: '100%' }}
            src={previewImage}
          />
        )}
        {fileType === 'video' && (
          <video src={previewImage} controls width={'100%'} height={'auto'} />
        )}
      </Modal>
    </>
  );
};
