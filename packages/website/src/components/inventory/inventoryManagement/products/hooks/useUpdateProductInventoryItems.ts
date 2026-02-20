import { useCallback, useMemo } from 'react';

import { useUpdateProductInventoryItemMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { FetchResult } from '@apollo/client';
import {
  getItemsForCreate,
  getItemsForUpdate,
} from '@inventory/inventoryManagement/helpers/helpers';
import { useCreateProductInventoryItem } from '@inventory/inventoryManagement/products/hooks/useCreateProductInventoryItem';
import { ProductInventoryItemValues } from '@inventory/inventoryManagement/products/types';
import omit from 'lodash/omit';

type ReturnType = {
  initialValues: ProductInventoryItemValues[] | undefined;
  handleUpdateProductInventoryItems: (
    values?: ProductInventoryItemValues[],
    productId?: Maybe<string>,
  ) => Promise<
    | (void | FetchResult<UpdateProductInventoryItemMutation> | undefined)[]
    | undefined
  >;
  isUpdateLoading: boolean;
};

export const useUpdateProductInventoryItems = (
  data?: ProductInventoryItemPageFragment[],
): ReturnType => {
  const message = useStatusMessage();

  const initialValues: ProductInventoryItemValues[] | undefined =
    useMemo(() => {
      return data?.map((item) => {
        const { id, attributes } = item;

        const {
          businessLocation,
          sublocation,
          serializes,
          vendor,
          tax,
          taxCollection,
          ...restValues
        } = attributes || {};

        const taxId = tax?.data?.id;
        const taxCollectionId = taxCollection?.data?.id;

        return {
          id,
          ...omit(restValues, [
            '__typename',
            'product',
            'uuid',
            'favorite',
            'sublocationItems',
            'productOrderItems',
            'wholesalePrice',
            'rentalPrice',
          ]),
          prevSerialNumbers: serializes?.data.map((item) => item.id),
          serializes: [],
          businessLocation: businessLocation?.data?.id,
          sublocation: sublocation?.data?.id,
          vendor: vendor?.data?.id,
          taxOrTaxCollection: taxId
            ? { tax: taxId }
            : taxCollectionId
            ? { taxCollection: taxCollectionId }
            : undefined,
        };
      });
    }, [data]);

  const [updateProductInventoryItem, { loading: updateLoading }] =
    useUpdateProductInventoryItemMutation({
      onError: () => {
        message.open('error');
      },
      refetchQueries: [
        'productInventoryItemsSelect',
        'subLocations',
        'subLocationsList',
        'productInventoryItemsPos',
      ],
    });
  const { handleCreate: createProductInventoryItem, loading: createLoading } =
    useCreateProductInventoryItem();

  const handleUpdateProductInventoryItems = useCallback(
    async (
      values?: ProductInventoryItemValues[],
      productId?: Maybe<string>,
    ) => {
      if (!productId) {
        return;
      }

      const filteredValues = values?.filter(
        (item) =>
          item.eventQuantity !== undefined && item.itemVendor !== undefined,
      );

      const sanitizedInitialValues = initialValues?.map(
        ({ quantity, ...restInitialValues }) => restInitialValues,
      );
      const sanitizedNewValues = values?.map(
        ({
          quantity,
          eventQuantity,
          itemCost,
          itemVendor,
          receiveDate,
          memo,
          expiryDate,
          paid,
          inputInvoiceNum,
          ...restNewValues
        }) => restNewValues,
      );

      const itemsForUpdate = getItemsForUpdate({
        initialValues: sanitizedInitialValues,
        newValues: sanitizedNewValues,
      });

      const itemsForCreate = getItemsForCreate(filteredValues);

      const updatePromises =
        itemsForUpdate?.map(async (item) => {
          const { id, taxOrTaxCollection, ...restValues } = omit(item, [
            'sublocation',
            'itemVendor',
            'itemCost',
            'eventQuantity',
            'receiveDate',
            'memo',
            'serializes',
            'prevSerialNumbers',
            'productOrderItems',
            'active',
            'isNegativeCount',
            'paid',
            'inputInvoiceNum',
          ]);

          if (!id) {
            return;
          }

          return await updateProductInventoryItem({
            variables: {
              id,
              input: {
                ...restValues,
                product: productId,
                ...taxOrTaxCollection,
              },
            },
          });
        }) || [];

      const createPromises =
        itemsForCreate?.map(async (values) => {
          return await createProductInventoryItem(values, productId);
        }) || [];

      return Promise.all([...updatePromises, ...createPromises]);
    },
    [createProductInventoryItem, initialValues, updateProductInventoryItem],
  );

  return {
    initialValues,
    handleUpdateProductInventoryItems,
    isUpdateLoading: updateLoading || createLoading,
  };
};
