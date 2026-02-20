import {
  useCreateProductTypeMutation,
  useDeleteProductTypeMutation,
} from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { ReturnUseEntityType } from '@inventory/inventoryManagement/products/types';
import { useCallback } from 'react';

export function useProductType(
  onChange: (values: string) => void,
): ReturnUseEntityType {
  const message = useStatusMessage();

  const [createProductType, { loading: createLoading }] =
    useCreateProductTypeMutation({
      refetchQueries: ['productTypes'],
    });

  const [remove, { loading: removeLoading }] = useDeleteProductTypeMutation({
    refetchQueries: ['productTypes'],
  });

  const handleCreate = useCallback(
    async (name: string) => {
      await createProductType({
        variables: {
          input: {
            name,
            editable: true,
          },
        },
        onCompleted: async (data) => {
          if (data?.createProductType?.data?.id) {
            onChange(data.createProductType.data.id);
            message.open('success', 'Option added successfully');
          }
        },
      });
    },
    [createProductType, message, onChange],
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
