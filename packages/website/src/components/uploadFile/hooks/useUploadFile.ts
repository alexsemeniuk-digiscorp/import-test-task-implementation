import { useUploadFileMutation } from '@/graphql';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';
import { UploadEntityData } from '@components/uploadFile/types';

export const useUploadFile = (refetchQueries: string[] | [] = []) => {
  const message = useStatusMessage();

  const [upload, { loading, data }] = useUploadFileMutation({
    onError: () => {
      message?.open('error');
    },
    refetchQueries: refetchQueries,
  });

  const handleUpload = async (file: File, entityData?: UploadEntityData) => {
    return await upload({
      variables: {
        file,
        ...(entityData ? entityData : {}),
      },
    });
  };

  return {
    handleUpload,
    loading,
    data,
  };
};
