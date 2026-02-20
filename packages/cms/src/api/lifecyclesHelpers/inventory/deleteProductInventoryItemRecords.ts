import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';

export const deleteProductInventoryItemRecords: LifecycleHook = async ({
  params,
}) => {
  handleLogger(
    'info',
    'ProductInventoryItemEvent beforeDelete deleteProductInventoryItemRecords',
    `Params :: ${JSON.stringify(params)}`,
  );
  const entityId = params?.where?.id;

  const productInventoryItemRecords = await strapi.entityService.findMany(
    'api::invt-itm-record.invt-itm-record',
    {
      filters: {
        productInventoryItemEvent: {
          id: {
            $eq: entityId,
          },
        },
      },
      fields: ['id'],
    },
  );

  if (productInventoryItemRecords && productInventoryItemRecords?.length > 0) {
    await Promise.all(
      productInventoryItemRecords.map(async (productInventoryItemRecord) => {
        await strapi.entityService.delete(
          'api::invt-itm-record.invt-itm-record',
          productInventoryItemRecord.id,
        );
      }),
    );
  }
};
