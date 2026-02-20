import {
  useCreateProductBrandMutation,
  useDeleteProductBrandMutation,
} from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { ReturnUseEntityType } from '@inventory/inventoryManagement/products/types';
import { useCallback } from 'react';

export function useProductBrand(
  onChange: (values: string) => void,
): ReturnUseEntityType {
  const message = useStatusMessage();

  const [createProductBrand, { loading: createLoading }] =
    useCreateProductBrandMutation({
      refetchQueries: ['productBrands'],
    });

  const [remove, { loading: removeLoading }] = useDeleteProductBrandMutation({
    refetchQueries: ['productBrands'],
  });

  const handleCreate = useCallback(
    async (name: string) => {
      await createProductBrand({
        variables: {
          input: {
            name,
            editable: true,
          },
        },
        onCompleted: async (data) => {
          if (data?.createProductBrand?.data?.id) {
            onChange(data.createProductBrand.data.id);
            message.open('success', 'Option added successfully');
          }
        },
      });
    },
    [createProductBrand, message, onChange],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      await remove({
        variables: {
          id,
        },
        onCompleted: async () => {
          onChange('');
          message.open('success', 'Option removed successfully');
        },
      });
    },
    [message, onChange, remove],
  );

  return {
    mutationLoading: createLoading || removeLoading,
    handleCreate,
    handleRemove,
  };
}
