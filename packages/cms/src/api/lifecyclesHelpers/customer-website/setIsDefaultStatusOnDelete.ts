import { LifecycleHook } from '../types';

export const setIssDefaultStatusOnDelete: LifecycleHook = async ({
  params,
}) => {
  const currentItemId = params?.where?.id;
  const currentItem = await strapi.entityService.findOne(
    'api::shipment-card.shipment-card',
    currentItemId,
    {
      fields: ['id', 'isDefault'],
      populate: {
        owner: {
          fields: ['id'],
        },
      },
    },
  );

  const allShipmentItems = await strapi.entityService.findMany(
    'api::shipment-card.shipment-card',
    {
      filters: {
        owner: {
          id: {
            $eq: currentItem?.owner?.id,
          },
        },
      },
      fields: ['id'],
    },
  );

  if (currentItem?.isDefault && allShipmentItems?.length > 1) {
    const newDefaultItem = await strapi.entityService.findMany(
      'api::shipment-card.shipment-card',
      {
        filters: {
          $and: [
            {
              isDefault: {
                $eq: false,
              },
            },
            {
              owner: {
                id: {
                  $eq: currentItem?.owner?.id,
                },
              },
            },
          ],
        },
        fields: ['id'],
        sort: ['createdAt:desc'],
      },
    );
    await strapi.entityService.update(
      'api::shipment-card.shipment-card',
      newDefaultItem[0]?.id,
      {
        data: {
          isDefault: true,
        },
      },
    );
  }
};
