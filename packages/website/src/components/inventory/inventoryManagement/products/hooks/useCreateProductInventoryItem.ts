import { useCallback } from 'react';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { ProductInventoryItemValues } from '@inventory/inventoryManagement/products/types';

type ReturnType = {
  handleCreate: (
    values: ProductInventoryItemValues,
    productId: string,
  ) => Promise<void>;
  loading: boolean;
};

export const useCreateProductInventoryItem = (): ReturnType => {
  const message = useStatusMessage();

  const handleCreate = useCallback(async () => {
    message.open('success', 'Success!');
  }, [message]);

  return {
    handleCreate,
    loading: false,
  };
};
