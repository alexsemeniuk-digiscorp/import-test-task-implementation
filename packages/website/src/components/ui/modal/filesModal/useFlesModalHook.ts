import {
  GetChangeHandler,
  useCustomForm,
} from '@/components/form/hooks/useCustomForm';
import { UploadFile } from 'antd';
import { FormInstance, useWatch } from 'antd/es/form/Form';
import { useState } from 'react';

interface UseUserModalReturn {
  open: boolean;
  showUserModal: () => void;
  hideUserModal: () => void;
  filesForm: FormInstance<{ files: UploadFile[] }>;
  handleFilesChange: GetChangeHandler<{ files: UploadFile[] }>;
  files: UploadFile[];
}

const useFilesModalHook = (): UseUserModalReturn => {
  const [open, setOpen] = useState<boolean>(false);
  const [filesForm, handleFilesChange] = useCustomForm<{
    files: UploadFile[];
  }>();
  const files = useWatch('files', filesForm);

  const showUserModal = (): void => {
    setOpen(true);
  };

  const hideUserModal = (): void => {
    filesForm.submit();
    setOpen(false);
  };

  return {
    open,
    showUserModal,
    hideUserModal,
    filesForm,
    handleFilesChange,
    files,
  };
};

export default useFilesModalHook;
