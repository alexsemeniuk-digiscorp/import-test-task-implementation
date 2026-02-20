import { FC, useState } from 'react';

import { Flex, Space, Typography, Upload, UploadFile, UploadProps } from 'antd';

import { dummyFileRequest } from '@components/uploadFile/helpers';

import { Icon } from '@assets/icon';

import useModalWebcamHook from '@/components/ui/modal/filesModal/useModalWebcamHook';
import FileList from '@components/uploadFile/ModalFileUpload/FileList';
import { UploadMultipleFilesButton } from '@components/uploadFile/ModalFileUpload/UploadMultipleFilesButton';
import { CustomButton } from '@ui/button/Button';
import ModalWebcam from '@ui/modal/filesModal/ModalWebcam';
import styles from './ModalFileUploadList.module.scss';

interface Props extends UploadProps {
  onFilesChange: (files: UploadFile[]) => void;
  initialValues?: UploadFile[];
  maxCount?: number;
  acceptFileType?: string;
}
export const ModalFileUploadList: FC<Props> = ({
  onFilesChange,
  initialValues,
  acceptFileType = 'image/*',
  ...otherProps
}) => {
  const { isModalOpen, showModal, handleCancel } = useModalWebcamHook();
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialValues?.length ? initialValues : [],
  );
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <Space direction={'vertical'} size={8} className={styles.centeredSpace}>
      <Icon type={'upload'} />
      <Typography.Text type={'secondary'}>Drop Files Here</Typography.Text>
      <Typography.Text type={'secondary'}>or</Typography.Text>
      <Typography.Text type={'secondary'}>Click to Browse</Typography.Text>
    </Space>
  );

  return (
    <>
      <Upload
        {...otherProps}
        listType={'picture-card'}
        onChange={handleChange}
        fileList={fileList}
        customRequest={dummyFileRequest}
        className={styles.uploadImageList}
        multiple={true}
        accept={acceptFileType}
        showUploadList={{
          removeIcon: <Icon type={'delete'} />,
          showRemoveIcon: true,
        }}
      >
        {uploadButton}
      </Upload>
      <FileList
        fileList={fileList as UploadFile[]}
        setFileList={setFileList}
        onFileChange={onFilesChange}
      />
      <Flex
        justify={'space-around'}
        style={{
          height: 30,
          width: '100%',
          marginTop: 10,
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <UploadMultipleFilesButton
          acceptFileType={acceptFileType}
          fileList={fileList}
          style={{ minWidth: 140 }}
          size={'large'}
          dummyRequest={dummyFileRequest}
          onFileChange={handleChange}
        />
        <CustomButton onClick={showModal} size={'large'}>
          Use WebCam
        </CustomButton>
      </Flex>
      <ModalWebcam
        isModalOpen={isModalOpen}
        setFileList={setFileList}
        handleCancel={handleCancel}
      />
    </>
  );
};
