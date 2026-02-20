import { Flex, Modal } from 'antd';
import React from 'react';

interface PreviewModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  activeSrc: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isModalOpen,
  handleCancel,
  activeSrc,
}) => {
  return (
    <Modal
      title={'Preview'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Flex justify={'center'}>
        <img style={{ width: 600 }} src={activeSrc} />
      </Flex>
    </Modal>
  );
};

export default PreviewModal;
