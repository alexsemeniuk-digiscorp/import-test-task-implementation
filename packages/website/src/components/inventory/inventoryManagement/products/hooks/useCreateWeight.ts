import { useCallback } from 'react';

import { useCreateWeightMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { WeightValues } from '@inventory/inventoryManagement/products/types';

type ReturnType = {
  loading: boolean;
  handleCreate: (values: WeightValues, id: string) => Promise<void>;
};

export const useCreateWeight = (type: 'product' | 'stone'): ReturnType => {
  const message = useStatusMessage();

  const [createWeight, { loading }] = useCreateWeightMutation({
    onError: () => {
      message.open('error');
    },
  });

  const handleCreate = useCallback(
    async (values: WeightValues, entityId: string) => {
      if (!values.value) {
        return;
      }
      if (type === 'product') {
        await createWeight({
          variables: {
            input: {
              ...values,
              product: entityId,
            },
          },
        });
      }
    },
    [createWeight, type],
  );

  return {
    handleCreate,
    loading,
  };
};
