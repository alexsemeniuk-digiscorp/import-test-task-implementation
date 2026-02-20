import { useCallback } from 'react';

import { useCreateDimensionMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { DimensionValues } from '@inventory/inventoryManagement/products/types';

type ReturnType = {
  handleCreate: (values: DimensionValues, productId: string) => Promise<void>;
  loading: boolean;
};

export const useCreateDimension = (): ReturnType => {
  const message = useStatusMessage();

  const [createDimension, { loading }] = useCreateDimensionMutation({
    onError: () => {
      message.open('error');
    },
  });

  const handleCreate = useCallback(
    async (values: DimensionValues, productId: string) => {
      if (!values) {
        return;
      }

      await createDimension({
        variables: {
          input: {
            ...values,
            product: productId,
          },
        },
      });
    },
    [createDimension],
  );

  return {
    handleCreate,
    loading,
  };
};
