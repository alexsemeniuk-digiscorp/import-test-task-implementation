import { LifecycleHook } from '../types';

export const updateIsDefaultStatus: LifecycleHook = async ({ params }) => {
  const currentCardId = params?.where?.id;
  const currentCard = await strapi.entityService.findOne(
    'api::shipment-card.shipment-card',
    currentCardId,
    {
      fields: ['id'],
      populate: {
        owner: {
          fields: ['id'],
        },
      },
    },
  );
  if (params?.data?.isDefault) {
    const defaultItem = await strapi.entityService.findMany(
      'api::shipment-card.shipment-card',
      {
        filters: {
          $and: [
            {
              isDefault: {
                $eq: true,
              },
            },
            {
              owner: {
                id: {
                  $eq: currentCard?.owner?.id,
                },
              },
            },
          ],
        },
        fields: ['id'],
      },
    );
    defaultItem?.map(async (it) => {
      return await strapi.entityService.update(
        'api::shipment-card.shipment-card',
        it?.id,
        {
          data: {
            isDefault: false,
          },
        },
      );
    });
  }
};
