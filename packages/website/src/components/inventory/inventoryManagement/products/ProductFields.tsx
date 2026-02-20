import { FC, memo, useEffect } from 'react';

import { FormInstance, Input } from 'antd';

import { GetChangeHandler } from '@form/hooks/useCustomForm';

import { CustomFormItem } from '@form/item/FormItem';

import { ProductValues } from '@inventory/inventoryManagement/products/types';

export interface InitLabelPrintValuesType extends ProductValues {
  printQty: number;
  id: string;
  product: string;
  tag: string;
  sku: string;
  upc: string;
  mpn: string;
  price: number;
  barcode: string;
}

interface Props {
  getChangeHandler: GetChangeHandler<ProductValues>;
  type?: 'create' | 'update';
  initialValues?: ProductValues;
  form?: FormInstance<ProductValues>;
}

export const ProductFields: FC<Props> = memo(
  ({ getChangeHandler, initialValues, form, type = 'create' }) => {
    useEffect(() => {
      if (initialValues) {
        form?.setFieldsValue({
          isNegativeCount: initialValues?.isNegativeCount,
          returnable: initialValues.returnable,
          active: initialValues.active,
        });
      }
    }, [initialValues, form]);

    return (
      <>
        <CustomFormItem name={'name'} label={'Product Name'} required>
          <Input placeholder={'Enter Product Name'} />
        </CustomFormItem>
      </>
    );
  },
);
