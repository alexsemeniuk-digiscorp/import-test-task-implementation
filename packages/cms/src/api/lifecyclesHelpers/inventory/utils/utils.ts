import { AnyObject } from './../../../../api/discount/types';
import { InventoryEntityUid } from './../../../../api/lifecyclesHelpers/inventory/checkIsNameOrBarcodeUnique';

export const fetchInventoryEntities = async (
  uid: InventoryEntityUid,
  tenantFilter: AnyObject,
  isProduct: boolean,
  entityName?: string,
  entityBarcode?: string,
) => {
  const namesFilter = {
    ...tenantFilter,
    $or: [
      ...(entityName
        ? [
            {
              name: {
                $eq: entityName.trim(),
              },
            },
          ]
        : []),
    ],
  };
  const barcodeFilter = {
    ...tenantFilter,
    ...(entityBarcode &&
      isProduct && {
        barcode: {
          $eq: entityBarcode,
        },
      }),
  };

  const existingInventoryWithSameBarcode = await strapi.entityService.findMany(
    'api::product.product',
    {
      filters: barcodeFilter,
      fields: ['id'],
    },
  );
  const existingInventoryWithSameName = await strapi.entityService.findMany(
    uid,
    {
      filters: { ...namesFilter },
      fields: ['id'],
    },
  );

  return { existingInventoryWithSameName, existingInventoryWithSameBarcode };
};
