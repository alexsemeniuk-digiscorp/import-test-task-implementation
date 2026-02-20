import ImageItem from '@ui/modal/filesModal/ImageItem/ImageItem';
import PreviewModal from '@ui/modal/filesModal/PreviewModal';
import usePreviewModal from '@ui/modal/filesModal/usePreviewModal';
import { Col, Row, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';

type FileListProps = {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  onFileChange: (files: UploadFile[]) => void;
};

const FileList: React.FC<FileListProps> = ({
  fileList,
  setFileList,
  onFileChange,
}) => {
  const [fileImages, setFileImages] = useState<UploadFile[]>(fileList);
  const { activeSrc, isModalOpen, showModal, handleCancel } = usePreviewModal();

  useEffect(() => {
    setTimeout(() => {
      setFileImages(fileList);
    });
  }, [fileList]);

  useEffect(() => {
    onFileChange(fileImages);
  }, [fileImages, onFileChange]);

  return (
    <div>
      <Row gutter={[5, 5]}>
        {fileImages.map((file) => {
          const filterList = () => {
            setFileList((prevState) =>
              prevState.filter((img) => file?.uid !== img?.uid),
            );
          };
          return (
            <Col key={file.uid} span={6}>
              <ImageItem
                file={file}
                filterFunction={filterList}
                showModal={showModal}
              />
            </Col>
          );
        })}
      </Row>
      <PreviewModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        activeSrc={activeSrc}
      />
    </div>
  );
};

export default FileList;
