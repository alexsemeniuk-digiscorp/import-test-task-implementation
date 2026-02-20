import {
  useCreateItemCategoryMutation,
  useDeleteItemCategoryMutation,
} from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { ReturnUseEntityType } from '@inventory/inventoryManagement/products/types';
import { useCallback } from 'react';

export function useItemCategory(
  onChange: (values: string) => void,
): ReturnUseEntityType {
  const message = useStatusMessage();

  const [createItemCategory, { loading: createLoading }] =
    useCreateItemCategoryMutation({
      refetchQueries: ['itemCategories'],
    });

  const [remove, { loading: removeLoading }] = useDeleteItemCategoryMutation({
    refetchQueries: ['itemCategories'],
  });

  const handleCreate = useCallback(
    async (name: string) => {
      await createItemCategory({
        variables: {
          input: {
            name,
            editable: true,
          },
        },
        onCompleted: async (data) => {
          if (data?.createItemCategory?.data?.id) {
            onChange(data.createItemCategory.data.id);
            message.open('success', 'Option added successfully');
          }
        },
      });
    },
    [createItemCategory, message, onChange],
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
