import { useCallback, useMemo } from 'react';

import {
  useDeleteRentableDataMutation,
  useUpdateRentableDataMutation,
} from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { FetchResult } from '@apollo/client';
import { hasObjectChanged } from '@inventory/inventoryManagement/helpers/helpers';
import { useCreateRentableData } from '@inventory/inventoryManagement/products/hooks/useCreateRentableData';
import { RentableDataValues } from '@inventory/inventoryManagement/products/types';
import omit from 'lodash/omit';

type ReturnType = {
  handleUpdate: (
    values?: RentableDataValues,
    productId?: string,
  ) => Promise<void | '' | FetchResult<UpdateRentableDataMutation> | null>;
  initialValues: RentableDataValues | undefined;
  isUpdateLoading: boolean;
};

export const useUpdateRentableData = (
  rentableData?: Maybe<RentableDataFragment>,
): ReturnType => {
  const message = useStatusMessage();
  const { handleCreate: createRentableData, loading: createLoading } =
    useCreateRentableData();
  const [updateRentableData, { loading: updateLoading }] =
    useUpdateRentableDataMutation({
      onError: () => {
        message.open('error');
      },
    });

  const [removeRentableData, { loading: removeLoading }] =
    useDeleteRentableDataMutation({
      onError: () => {
        message.open('error');
      },
    });

  const initialValues: RentableDataValues | undefined = useMemo(() => {
    const { id, attributes } = rentableData || {};

    return id
      ? {
          id,
          ...omit(attributes || {}, ['__typename']),
        }
      : undefined;
  }, [rentableData]);

  const handleUpdate = useCallback(
    async (values?: RentableDataValues, productId?: string) => {
      if (!productId) {
        return;
      }

      if (!initialValues?.id && values !== undefined) {
        return createRentableData(values as RentableDataValues, productId);
      }

      if (values === undefined && initialValues?.id) {
        await removeRentableData({
          variables: {
            id: initialValues?.id as string,
          },
        });
      }

      if (values && hasObjectChanged({ newValues: values, initialValues })) {
        const { id, ...restValues } = values;

        await updateRentableData({
          variables: {
            id: id as string,
            input: {
              ...restValues,
              product: productId,
            },
          },
        });
      }
    },
    [createRentableData, initialValues, removeRentableData, updateRentableData],
  );

  return {
    handleUpdate,
    initialValues,
    isUpdateLoading: updateLoading || createLoading || removeLoading,
  };
};
