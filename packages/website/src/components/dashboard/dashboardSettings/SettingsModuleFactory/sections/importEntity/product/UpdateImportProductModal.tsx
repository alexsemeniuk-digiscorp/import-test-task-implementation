import { ProductDataWithErrors } from '@components/dashboard/dashboardSettings/SettingsModuleFactory/sections/importEntity/product/types/types';
import UpdateProductForm from '@inventory/inventoryManagement/products/UpdateProductForm';
import { Modal } from 'antd';
import React from 'react';
import ImportProductsTable from './ImportProductsTable';

interface MaxArrayCounts {
  maxProductsCount: number;
  maxImagesCount: number;
}

interface UpdateProductModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  data: ProductDataWithErrors;
  type?: string;
  loading?: boolean;
  maxArrayCounts: MaxArrayCounts;
  propsScroll?: number;
  uuid?: string;
  customFieldsColumns: string[];
  total?: number;
  onChange: (page: number, pageSize: number) => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  isModalOpen,
  handleCancel,
  maxArrayCounts,
  uuid,
  data,
  customFieldsColumns,
  total,
  onChange,
}) => (
  <Modal
    title={'Update previous product'}
    footer={null}
    width={1200}
    open={isModalOpen}
    onCancel={handleCancel}
  >
    <ImportProductsTable
      data={[data]}
      type={'completedImports'}
      loading={false}
      maxArrayCounts={maxArrayCounts}
      propsScroll={8000}
      customFieldsColumns={customFieldsColumns}
      total={total}
      onChange={onChange}
    />
    <UpdateProductForm uuid={uuid} />
  </Modal>
);

export default UpdateProductModal;
