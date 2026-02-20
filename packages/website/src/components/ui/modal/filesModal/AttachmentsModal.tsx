import { GetChangeHandler } from '@/components/form/hooks/useCustomForm';
import { ModalFileUploadList } from '@components/uploadFile/ModalFileUpload/ModalFileUploadList';
import { CustomForm } from '@form';
import { CustomFormItem } from '@form/item/FormItem';
import { Modal, ModalProps, UploadFile } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React from 'react';

type AttachmentsModalProps = ModalProps & {
  open: boolean;
  hideUserModal: () => void;
  filesForm: FormInstance<{ files: UploadFile[] }>;
  handleFilesChange: GetChangeHandler<{ files: UploadFile[] }>;
  acceptFileType?: string;
  files?: UploadFile[];
};

const AttachmentsModal: React.FC<AttachmentsModalProps> = ({
  open,
  hideUserModal,
  filesForm,
  handleFilesChange,
  acceptFileType,
  files,
  ...props
}) => {
  return (
    <Modal
      title={'Add Attachments'}
      open={open}
      footer={null}
      onCancel={hideUserModal}
      {...props}
    >
      <CustomForm form={filesForm} name={'attachmentsForm'}>
        <CustomFormItem name={'files'}>
          <ModalFileUploadList
            acceptFileType={acceptFileType}
            style={{ width: '100%' }}
            onFilesChange={handleFilesChange('files')}
            initialValues={files?.length ? files : undefined}
          />
        </CustomFormItem>
      </CustomForm>
    </Modal>
  );
};

export default AttachmentsModal;
