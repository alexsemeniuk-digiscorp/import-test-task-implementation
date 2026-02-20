import { handleError } from './../../../../../../../../../graphql/helpers/errors';

export const checkSerialNumbersAvailability = async ({
  serialNumbers,
  tenantFilter,
}) => {
  if (!serialNumbers || serialNumbers?.length === 0)
    return { isAllSerialNumbersAvailable: true, existedSerialNumbers: [] };

  try {
    // take all serial numbers
    const existedSerialNumbers = await strapi.entityService.findMany(
      'api::inventory-serialize.inventory-serialize',
      {
        filters: {
          ...tenantFilter,
          name: { $in: serialNumbers },
        },
        fields: ['id'],
        populate: {
          sellingProductOrderItem: {
            fields: ['id'],
          },
          returnItem: {
            fields: ['id'],
          },
          inventoryAdjustmentItem: {
            fields: ['id'],
          },
          transferOrderItem: {
            fields: ['id'],
          },
          productInventoryItem: {
            fields: ['id'],
          },
        },
      },
    );

    const isAllSerialNumbersAvailable = existedSerialNumbers.every(
      (serialNumber) => {
        const hasRelations =
          serialNumber?.sellingProductOrderItem?.id ||
          serialNumber?.returnItem?.id ||
          serialNumber?.inventoryAdjustmentItem?.id ||
          serialNumber?.transferOrderItem?.id ||
          serialNumber?.productInventoryItem?.id;

        return !hasRelations;
      },
    );
    // check that none of these serial numbers has relations
    return { isAllSerialNumbersAvailable, existedSerialNumbers };
  } catch (e) {
    handleError('checkSerialNumbersAvailability', undefined, e);
  }
};
