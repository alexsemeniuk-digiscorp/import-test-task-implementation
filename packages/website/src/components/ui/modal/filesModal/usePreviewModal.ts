import { Dispatch, SetStateAction, useState } from 'react';

interface UseModalReturnType {
  activeSrc: string;
  setActiveSrc: Dispatch<SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  showModal: () => void;
  handleCancel: () => void;
}

const usePreviewModal = (): UseModalReturnType => {
  const [activeSrc, setActiveSrc] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (src?: string) => {
    if (src) {
      setActiveSrc(src);
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return {
    activeSrc,
    setActiveSrc,
    isModalOpen,
    setIsModalOpen,
    showModal,
    handleCancel,
  };
};

export default usePreviewModal;
