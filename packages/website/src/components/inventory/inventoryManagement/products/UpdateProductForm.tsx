import { Loader } from '@components/layout/MainLayout';
import { useTenantRoutes } from '@router/routes';
import { FC } from 'react';

import { useCustomForm } from '@form/hooks/useCustomForm';

import { UpdateEntityForm } from '@inventory/inventoryManagement/forms/UpdateEntityForm';
import { useGetEntityByUuid } from '@inventory/inventoryManagement/hooks/useGetEntityByUuid';
import { ProductFields } from '@inventory/inventoryManagement/products/ProductFields';
import { useUpdateProduct } from '@inventory/inventoryManagement/products/hooks/useUpdateProduct';
import { ProductValues } from '@inventory/inventoryManagement/products/types';
import { CustomButton } from '@ui/button/Button';

interface Props {
  uuid?: string;
}

const UpdateProductForm: FC<Props> = ({ uuid }) => {
  const { data, loading, handleTriggerRefetch } = useGetEntityByUuid(
    'products',
    uuid,
  );

  const [form, handleChange] = useCustomForm<ProductValues>();

  const {
    inventory: { inventoryManagement },
  } = useTenantRoutes();

  const {
    handleUpdate,
    initialValues,
    hasUpdatedValues,
    isUpdateLoading,
    handleUpdateAndQuickPrint,
  } = useUpdateProduct({
    form,
    data,
    handleTriggerRefetch,
  });

  const extraActions = [
    <CustomButton
      key={'save-quick-print'}
      type='primary'
      block
      size={'large'}
      onClick={() => handleUpdateAndQuickPrint(form.getFieldsValue())}
      loading={isUpdateLoading}
      disabled={isUpdateLoading || !hasUpdatedValues}
    >
      Save and Quick Print
    </CustomButton>,
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <UpdateEntityForm<ProductValues>
      form={form}
      initialValues={initialValues}
      loading={isUpdateLoading}
      onFinish={handleUpdate}
      isSaveDisabled={isUpdateLoading || !hasUpdatedValues}
      backPath={inventoryManagement.products.index}
      entityName={'Product'}
      extraActions={extraActions}
    >
      <ProductFields
        getChangeHandler={handleChange}
        initialValues={initialValues}
        form={form}
        type={'update'}
      />
    </UpdateEntityForm>
  );
};

export default UpdateProductForm;
