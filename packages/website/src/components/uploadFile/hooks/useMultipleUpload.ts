import { useCallback } from 'react';

import { useMultipleUploadMutation } from '@/graphql';

import { UploadEntityData } from '@components/uploadFile/types';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

export const useMultipleUpload = () => {
  const message = useStatusMessage();

  const [upload, { loading, data }] = useMultipleUploadMutation({
    onError: () => {
      message.open('error', 'Error during uploading files.');
    },
    refetchQueries: [
      'orderCustomer',
      'orderByIdInfoDrawer',
      'orderByIdRequest',
      'orderByIdEditDrawer',
      'ordersPosActive',
      'ordersRefundAmount',
    ],
  });

  const handleUpload = useCallback(
    async (files: File[], entityData?: UploadEntityData) => {
      return await upload({
        variables: {
          files,
          ...(entityData ? entityData : {}),
        },
      });
    },
    [upload],
  );

  return {
    handleUpload,
    loading,
    data,
  };
};
