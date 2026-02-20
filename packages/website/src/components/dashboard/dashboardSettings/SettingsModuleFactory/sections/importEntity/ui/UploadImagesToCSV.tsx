import { FC, memo, useState } from 'react';

import { ImagesUploadModal } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/ui/ImagesUploadModal';
import { CustomButton } from '@ui/button/Button';
import { ButtonProps, Modal } from 'antd';
import { ButtonType } from 'antd/es/button/buttonHelpers';

interface Props extends ButtonProps {
  label?: string;
  type?: ButtonType;
  loading?: boolean;
}

const UploadImagesToCSVModal: FC<Props> = memo(({ label, ...props }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleHideModal = (): void => {
    setOpen(false);
  };

  return (
    <>
      <CustomButton
        {...props}
        type={'default'}
        style={{ minWidth: 140 }}
        size={'large'}
        onClick={() => setOpen(true)}
      >
        {label}
      </CustomButton>
      <Modal
        title={'Upload Images'}
        open={open}
        footer={null}
        onCancel={handleHideModal}
      >
        <ImagesUploadModal
          style={{ width: '100%' }}
          onCancel={handleHideModal}
        />
      </Modal>
    </>
  );
});

export default UploadImagesToCSVModal;
