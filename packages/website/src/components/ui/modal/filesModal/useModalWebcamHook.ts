import { useCallback, useState } from 'react';

interface UseModalReturn {
  isModalOpen: boolean;
  showModal: () => void;
  handleCancel: () => void;
}

const useModalWebcamHook = (): UseModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    showModal,
    handleCancel,
  };
};

export default useModalWebcamHook;
