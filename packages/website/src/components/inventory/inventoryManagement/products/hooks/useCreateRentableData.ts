import { useCallback } from 'react';

import { useCreateRentableDataMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { RentableDataValues } from '@inventory/inventoryManagement/products/types';

type ReturnType = {
  handleCreate: (
    values: RentableDataValues,
    productId: string,
  ) => Promise<void>;
  loading: boolean;
};

export const useCreateRentableData = (): ReturnType => {
  const message = useStatusMessage();

  const [createRentableData, { loading }] = useCreateRentableDataMutation({
    onError: () => {
      message.open('error');
    },
  });

  const handleCreate = useCallback(
    async (values: RentableDataValues, productId: string) => {
      await createRentableData({
        variables: {
          input: {
            ...values,
            enabled: true,
            product: productId,
          },
        },
      });
    },
    [createRentableData],
  );

  return {
    handleCreate,
    loading,
  };
};
