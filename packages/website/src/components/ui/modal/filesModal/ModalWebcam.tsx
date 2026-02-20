import { WebcamCapture } from '@components/uploadFile/ModalFileUpload/WebcamCapture';
import { Modal, UploadFile } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';

interface ModalWebcamProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
}

const ModalWebcam: FC<ModalWebcamProps> = ({
  isModalOpen,
  handleCancel,
  setFileList,
}) => {
  return (
    <Modal
      title={'Web Cam'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={900}
    >
      <WebcamCapture onCancel={handleCancel} setFileList={setFileList} />
    </Modal>
  );
};

export default ModalWebcam;
