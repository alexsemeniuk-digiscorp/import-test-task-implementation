import { useDeleteUploadFileMutation } from '@/graphql';
import { useUploadFile } from '@components/uploadFile/hooks/useUploadFile';
import { RefType } from '@helpers/types';
import { hasObjectChanged } from '@inventory/inventoryManagement/helpers/helpers';
import { UploadFile } from 'antd';
import omit from 'lodash/omit';
import { useCallback } from 'react';

type ReturnType = {
  loading: boolean;
  handleUpdate: (
    refId: string,
    value?: UploadFile | File | null,
    initialValue?: UploadFile | null,
  ) => Promise<void>;
};

export function useUpdateFile({
  ref,
  field = 'files',
  refetchQueries = [],
}: {
  ref: RefType;
  field: string;
  refetchQueries: string[] | [];
}): ReturnType {
  const [deleteUploadFile, { loading: deleteLoading }] =
    useDeleteUploadFileMutation({
      refetchQueries,
    });

  const { handleUpload, loading: createFileLoading } =
    useUploadFile(refetchQueries);

  const handleUpdate = useCallback(
    async (
      refId: string,
      value?: UploadFile | File | null,
      initialValue?: UploadFile | null,
    ) => {
      if (!value && !initialValue) {
        return;
      }

      const isLogoChanged = hasObjectChanged({
        initialValues: omit(initialValue),
        newValues: omit(value),
      });

      if (isLogoChanged && initialValue) {
        await deleteUploadFile({
          variables: {
            id: initialValue?.uid,
          },
        });
      }

      if (isLogoChanged && value) {
        await handleUpload(value as File, {
          ref,
          refId,
          field,
        });
      }
    },
    [deleteUploadFile, field, handleUpload, ref],
  );

  return {
    loading: deleteLoading || createFileLoading,
    handleUpdate,
  };
}
