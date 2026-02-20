import { useCallback } from 'react';

import { UploadFile } from 'antd';

import { transformAntdFileToFileObj } from '@components/uploadFile/helpers';
import { useMultipleUpload } from '@components/uploadFile/hooks/useMultipleUpload';
import { UploadEntityData } from '@components/uploadFile/types';

import { isNotEmpty, OptionalField } from '@helpers/types';

export const useCreateFiles = ({
  ref,
  field = 'files',
}: Omit<OptionalField<UploadEntityData, 'field'>, 'refId'>) => {
  const { handleUpload, loading } = useMultipleUpload();

  const handleCreate = useCallback(
    async (values?: UploadFile[], refId?: string) => {
      const fileObjects = values
        ?.map(transformAntdFileToFileObj)
        .filter(isNotEmpty);

      if (fileObjects?.length && refId) {
        await handleUpload(fileObjects, {
          ref,
          refId,
          field,
        });
      }
    },
    [ref, field, handleUpload],
  );

  return {
    handleCreate,
    loading,
  };
};
