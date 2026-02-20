import { useCallback } from 'react';

import { UploadFile } from 'antd';

import { useDeleteUploadFileMutation } from '@/graphql';

import { UploadEntityData } from '@components/uploadFile/types';

import { OptionalField } from '@helpers/types';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { useCreateFiles } from '@inventory/inventoryManagement/hooks/useCreateFiles';

export const useUpdateFiles = ({
  ref,
  field = 'files',
  refetchQueries = [],
}: Omit<OptionalField<UploadEntityData, 'field'>, 'refId'> & {
  refetchQueries?: string[];
}) => {
  const message = useStatusMessage();

  const [deleteUploadFile, { loading: deleteLoading }] =
    useDeleteUploadFileMutation({
      onError: () => {
        message.open('error');
      },
      refetchQueries: refetchQueries,
    });

  const { handleCreate, loading: createLoading } = useCreateFiles({
    ref,
    field,
  });

  const handleUpdate = useCallback(
    async (
      values?: UploadFile[],
      initialValues?: UploadFile[],
      refId?: string,
    ) => {
      if (!values?.length && !initialValues?.length) {
        return;
      }

      const filesToDelete = initialValues?.filter((item) => {
        return !values?.find((value) => {
          return value.uid === item.uid;
        });
      });

      await Promise.all(
        filesToDelete?.map((file) => {
          return deleteUploadFile({
            variables: {
              id: file.uid,
            },
          });
        }) || [],
      );

      const filesToCreate = values?.filter((file) => !file?.url);

      await handleCreate(filesToCreate, refId);
    },
    [handleCreate, deleteUploadFile],
  );

  return {
    handleUpdate,
    isUpdateLoading: deleteLoading || createLoading,
  };
};
