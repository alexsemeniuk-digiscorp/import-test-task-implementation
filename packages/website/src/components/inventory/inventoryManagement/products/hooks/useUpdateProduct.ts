import { useCallback, useMemo } from 'react';

import { Form, FormInstance } from 'antd';

import dayjs from 'dayjs';
import { isEqual, omit } from 'lodash';

import { useUpdateProductMutation } from '@/graphql';

import { transformGqlFileToAntd } from '@components/uploadFile/helpers';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { hasObjectChanged } from '@inventory/inventoryManagement/helpers/helpers';
import { useUpdateFiles } from '@inventory/inventoryManagement/hooks/useUpdateFiles';
import { useUpdateDimension } from '@inventory/inventoryManagement/products/hooks/useUpdateDimension';
import { useUpdateProductInventoryItems } from '@inventory/inventoryManagement/products/hooks/useUpdateProductInventoryItems';
import { useUpdateRentableData } from '@inventory/inventoryManagement/products/hooks/useUpdateRentableData';
import { useUpdateWeight } from '@inventory/inventoryManagement/products/hooks/useUpdateWeight';
import {
  DimensionValues,
  ProductValues,
} from '@inventory/inventoryManagement/products/types';

type ReturnType = {
  initialValues: ProductValues;
  handleUpdate: (values: ProductValues) => Promise<void>;
  hasUpdatedValues: boolean;
  isUpdateLoading: boolean;
  handleUpdateAndQuickPrint: (values: ProductValues) => Promise<void>;
};

interface Props {
  form: FormInstance<ProductValues>;
  data?: ProductByUuidQuery;
  handleTriggerRefetch?: () => Promise<void>;
}

export const useUpdateProduct = ({
  form,
  data,
  handleTriggerRefetch,
}: Props): ReturnType => {
  const message = useStatusMessage();

  const product = data?.products?.data[0];

  const {
    handleUpdateProductInventoryItems,
    initialValues: productInventoryItemInitialValues,
    isUpdateLoading: updateProductInventoryItemLoading,
  } = useUpdateProductInventoryItems(
    product?.attributes?.productInventoryItems?.data,
  );

  const {
    handleUpdate: handleUpdateWeight,
    initialValues: weightInitialValues,
    isUpdateLoading: updateWeightLoading,
  } = useUpdateWeight('product', product?.attributes?.weight?.data);

  const {
    handleUpdate: handleUpdateDimension,
    initialValues: dimensionInitialValues,
    isUpdateLoading: updateDimensionLoading,
  } = useUpdateDimension(product?.attributes?.dimension?.data);

  const {
    handleUpdate: handleUpdateRentableData,
    initialValues: rentableDataInitialValues,
    isUpdateLoading: updateRentableDataLoading,
  } = useUpdateRentableData(product?.attributes?.rentableData?.data);

  const initialValues: ProductValues = useMemo(() => {
    const { attributes, id } = product || {};

    const {
      files,
      partsWarranty,
      laborWarranty,
      expiryDate,
      brand,
      productType,
      isNegativeCount,
      productAttributeOptions,
      active,
      returnable,
      ...restAttributes
    } = attributes || {};

    return {
      ...omit(restAttributes, ['__typename', 'uuid', 'favorite']),
      id: id as string,
      files: files?.data.map(transformGqlFileToAntd),
      brand: brand?.data?.id,
      productType: productType?.data?.id,
      partsWarranty: partsWarranty ? dayjs(partsWarranty) : undefined,
      laborWarranty: laborWarranty ? dayjs(laborWarranty) : undefined,
      ...(expiryDate
        ? {
            expiryDate: dayjs(expiryDate),
          }
        : {}),
      productInventoryItems: productInventoryItemInitialValues,
      dimension: dimensionInitialValues,
      weight: weightInitialValues,
      rentableData: rentableDataInitialValues,
      productAttributeOptions: productAttributeOptions?.data.map(
        (optionData) => ({
          attributeId: optionData?.attributes?.productAttribute?.data?.id,
          optionId: optionData?.id,
        }),
      ),
      returnable: returnable,
      trackProductInventory: true,
      isNegativeCount: isNegativeCount,
      active: active,
      isTrackSwitched: true,
    };
  }, [
    product,
    productInventoryItemInitialValues,
    weightInitialValues,
    dimensionInitialValues,
    rentableDataInitialValues,
  ]);

  const [updateProduct, { loading: updateLoading }] = useUpdateProductMutation({
    onError: () => {
      message.open('error', 'Product was not updated');
    },
    refetchQueries: [
      'inventoryProductsTable',
      'websiteProductsTable',
      'subLocations',
      'subLocationsList',
      'productInventoryItemsPos',
      'productInventoryItemsSelect',
    ],
  });
  const { handleUpdate: updateFiles, isUpdateLoading: updateFilesLoading } =
    useUpdateFiles({
      ref: 'api::product.product',
    });

  const handleUpdate = useCallback(
    async (values: ProductValues) => {
      const {
        productInventoryItems,
        files,
        dimension,
        weight,
        rentableData,
        productAttributeOptions,
        ...rest
      } = values;

      if (!product?.id) {
        return;
      }

      if (
        hasObjectChanged({
          newValues: values,
          initialValues,
          additionalOmittedKeys: [
            'productInventoryItems',
            'files',
            'dimension',
            'weight',
            'rentableData',
          ],
        })
      ) {
        await updateProduct({
          variables: {
            id: product.id,
            input: {
              ...rest,
              partsWarranty: rest.partsWarranty?.toDate() || null,
              laborWarranty: rest.laborWarranty?.toDate() || null,
              expiryDate: rest.expiryDate?.toDate() || null,
              productAttributeOptions:
                productAttributeOptions?.map(({ optionId }) => optionId) ||
                null,
            },
          },
        });
      }

      await handleUpdateProductInventoryItems(
        productInventoryItems,
        product?.id,
      );

      await handleUpdateWeight(weight, product?.id);

      await handleUpdateDimension(dimension as DimensionValues, product?.id);

      await handleUpdateRentableData(rentableData, product?.id);

      await updateFiles(files, initialValues.files, product?.id);

      message.open('success', 'Product updated successfully');
      handleTriggerRefetch?.();
    },
    [
      product?.id,
      initialValues,
      handleUpdateProductInventoryItems,
      handleUpdateWeight,
      handleUpdateDimension,
      handleUpdateRentableData,
      updateFiles,
      message,
      handleTriggerRefetch,
      updateProduct,
    ],
  );

  const handleUpdateAndQuickPrint = useCallback(
    async (values: ProductValues) => {
      const {
        productInventoryItems,
        files,
        dimension,
        weight,
        rentableData,
        productAttributeOptions,
        ...rest
      } = values;

      if (!product?.id) {
        return;
      }

      if (
        hasObjectChanged({
          newValues: values,
          initialValues,
          additionalOmittedKeys: [
            'productInventoryItems',
            'files',
            'dimension',
            'weight',
            'rentableData',
          ],
        })
      ) {
        await updateProduct({
          variables: {
            id: product.id,
            input: {
              ...rest,
              partsWarranty: rest.partsWarranty?.toDate() || null,
              laborWarranty: rest.laborWarranty?.toDate() || null,
              expiryDate: rest.expiryDate?.toDate() || null,
              productAttributeOptions:
                productAttributeOptions?.map(({ optionId }) => optionId) ||
                null,
            },
          },
        });
      }

      await handleUpdateProductInventoryItems(
        productInventoryItems,
        product?.id,
      );

      await handleUpdateWeight(weight, product?.id);

      await handleUpdateDimension(dimension as DimensionValues, product?.id);

      await handleUpdateRentableData(rentableData, product?.id);

      await updateFiles(files, initialValues.files, product?.id);

      message.open('success', 'Product updated successfully');
      handleTriggerRefetch?.();

      const productData = [
        {
          id: product.id,
          printQty: 1,
          attributes: {
            product: rest?.name || '',
            tag: rest?.tagProductName || '',
            sku: rest?.SKU || '',
            upc: rest?.UPC || '',
            mpn: rest?.MPN || '',
            price: rest?.defaultPrice || 0,
            barcode: rest?.barcode || '',
          },
        },
      ];
    },
    [
      product?.id,
      initialValues,
      handleUpdateProductInventoryItems,
      handleUpdateWeight,
      handleUpdateDimension,
      handleUpdateRentableData,
      updateFiles,
      message,
      handleTriggerRefetch,
      updateProduct,
    ],
  );

  const formValues = Form.useWatch([], form);

  const hasUpdatedValues = useMemo(() => {
    if (!formValues) {
      return false;
    }

    if (Object.values(formValues).every((item) => item === undefined)) {
      return false;
    }

    const {
      rentableData,
      productAttributeOptions,
      productInventoryItems,
      ...restFormValues
    } = formValues;

    const hasProductChanged = hasObjectChanged({
      initialValues: omit(initialValues, [
        'rentableData',
        'productAttributeOptions',
        'productInventoryItems',
      ]),
      newValues: restFormValues,
    });

    const hasRentableDataChanged = initialValues.rentableData?.enabled
      ? hasObjectChanged({
          initialValues: initialValues.rentableData,
          newValues: rentableData,
        })
      : Boolean(rentableData);

    const hasProductAttributeOptionsChanged = initialValues
      .productAttributeOptions?.length
      ? !isEqual(initialValues.productAttributeOptions, productAttributeOptions)
      : Boolean(productAttributeOptions?.length);

    const hasProductInventoryItemsChanged = initialValues.productInventoryItems
      ?.length
      ? !isEqual(
          initialValues.productInventoryItems,
          productInventoryItems?.filter((item) => item.quantity !== undefined),
        )
      : Boolean(
          productInventoryItems?.filter(
            (item) =>
              item.eventQuantity !== undefined && item.itemVendor !== undefined,
          ).length,
        );

    return (
      hasProductChanged ||
      hasRentableDataChanged ||
      hasProductAttributeOptionsChanged ||
      hasProductInventoryItemsChanged
    );
  }, [formValues, initialValues]);

  return {
    initialValues,
    handleUpdate,
    hasUpdatedValues,
    handleUpdateAndQuickPrint,
    isUpdateLoading:
      updateLoading ||
      updateProductInventoryItemLoading ||
      updateWeightLoading ||
      updateDimensionLoading ||
      updateRentableDataLoading ||
      updateFilesLoading,
  };
};
