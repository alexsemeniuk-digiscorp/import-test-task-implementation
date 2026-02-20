import {
  useCreateSerializeMutation,
  useDeleteSerializeMutation,
} from '@/graphql';
import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { handleApplicationError } from '@helpers/errors';
import { ReturnUseEntityType } from '@inventory/inventoryManagement/products/types';
import { useCallback } from 'react';

export function useSerializedData(): ReturnUseEntityType {
  const message = useStatusMessage();

  const [createSerialize, { loading: createLoading }] =
    useCreateSerializeMutation({
      refetchQueries: ['serializesWithoutProduct'],
    });

  const [remove, { loading: removeLoading }] = useDeleteSerializeMutation({
    refetchQueries: ['serializesWithoutProduct'],
  });

  const handleCreate = useCallback(
    async (name: string) => {
      await createSerialize({
        variables: {
          input: {
            name,
            editable: true,
          },
        },
        onCompleted: async (data) => {
          if (data?.createInventorySerialize?.data?.id) {
            message.open('success', 'Option added successfully');
          }
        },
        onError: (error) => {
          handleApplicationError(error, message);
        },
      });
    },
    [createSerialize, message],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      await remove({
        variables: {
          id,
        },
        onCompleted: async () => {
          message.open('success', 'Option removed successfully');
        },
      });
    },
    [message, remove],
  );

  return {
    mutationLoading: createLoading || removeLoading,
    handleCreate,
    handleRemove,
  };
}
