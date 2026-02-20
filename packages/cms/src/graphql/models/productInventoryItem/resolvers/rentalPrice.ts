import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const rentalPrice: GraphQLFieldResolver<
  NexusGenRootTypes['ProductInventoryItem'] & { id: number },
  Graphql.ResolverContext
> = async (root): Promise<number> => {
  const entityId = root.id;

  const productInventoryItemService = strapi.service(
    'api::product-inventory-item.product-inventory-item',
  );
  const productItemReceiveEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  const productInventoryItem = await productInventoryItemService.findOne(
    entityId,
    {
      populate: ['product'],
    },
  );

  const productItemReceiveEvents = await productItemReceiveEventService.find({
    filters: {
      productInventoryItem: {
        id: {
          $eq: entityId,
        },
      },
      eventType: {
        $eq: 'receive',
      },
      remainingQuantity: {
        $ne: 0,
      },
    },
    sort: ['receiveDate:asc'],
  });

  const multiplier = productInventoryItem?.product?.multiplier;

  if (multiplier && productItemReceiveEvents[0]?.itemCost) {
    return Number(multiplier) * Number(productItemReceiveEvents[0]?.itemCost);
  } else {
    return 0;
  }
};
