import { GraphQLFieldResolver } from 'graphql';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export const quantityOnOrder: GraphQLFieldResolver<
  NexusGenRootTypes['InvtItmRecord'] & { id: number },
  Graphql.ResolverContext,
  { businessLocationId?: number }
> = async (root, args) => {
  const productInventoryItemRecord = await strapi.entityService.findOne(
    'api::invt-itm-record.invt-itm-record',
    root.id,
    {
      fields: ['id'],
      populate: {
        productInventoryItem: {
          fields: ['id'],
          populate: {
            product: {
              fields: ['id'],
            },
          },
        },
      },
    },
  );

  const productId =
    productInventoryItemRecord?.productInventoryItem?.product?.id;

  if (!productId) return;

  const productServices = strapi.service('api::product.product');

  return productServices.getQuantityOnOrder(productId, args.businessLocationId);
};
