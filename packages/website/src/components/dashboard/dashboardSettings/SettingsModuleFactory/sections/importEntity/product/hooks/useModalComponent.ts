import { useCallback, useState } from 'react';

export const useModalComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    showModal,
    closeModal,
  };
};
