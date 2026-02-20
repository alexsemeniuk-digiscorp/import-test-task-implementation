import { LifecycleHook } from '../types';

export const deleteRelatedDownloadRecords: LifecycleHook = async ({
  params,
}) => {
  const fileId = params?.where?.id;
  const deletingFileItem = await strapi?.entityService?.findOne(
    'api::file-item.file-item',
    fileId,
    { populate: ['attachedFile'] },
  );
  const deletingDownloadRecords = await strapi?.entityService?.findMany(
    'api::download-record.download-record',
    {
      populate: ['fileItem'],
      filters: { fileItem: { id: { $eq: fileId } } },
      fields: ['id'],
    },
  );

  if (deletingDownloadRecords?.length) {
    const promises = deletingDownloadRecords?.map(async (record) => {
      return await strapi?.entityService?.delete(
        'api::download-record.download-record',
        record?.id as number,
      );
    });
    await Promise.all(promises);
  }

  if (deletingFileItem?.attachedFile?.id) {
    await strapi
      .plugin('upload')
      .service('upload')
      .remove(deletingFileItem?.attachedFile);
  }
};
