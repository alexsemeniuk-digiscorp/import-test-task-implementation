import { useCreateProductInventoryItemMutation } from '@/graphql';
import { useCallback } from 'react';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
type ReturnType = {
  handleCreate: (
    productId: string,
    businessLocationId: string,
  ) => Promise<void>;
  loading: boolean;
};

export const useCreateEmptyInventoryItems = (): ReturnType => {
  const message = useStatusMessage();

  const [
    createProductInventoryItem,
    { loading: createProductInventoryItemLoading },
  ] = useCreateProductInventoryItemMutation({
    onError: () => {
      message.open('error');
    },
  });

  const loading = createProductInventoryItemLoading;

  const handleCreate = useCallback(
    async (productId: string, businessLocationId?: string) => {
      await createProductInventoryItem({
        variables: {
          input: {
            quantity: 0,
            product: productId,
            businessLocation: businessLocationId,
          },
        },
        refetchQueries: ['productByUuid', 'productByUuidPage'],
      });
    },
    [createProductInventoryItem],
  );

  return {
    handleCreate,
    loading,
  };
};
