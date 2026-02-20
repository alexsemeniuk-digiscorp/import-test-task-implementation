import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import {
  completedImportingData,
  WISHLIST_IMPORT_IDENTIFIER,
} from './../../../../../../api/redis/helpers/variables/importingVariables';
import { handleCompletedCreationError } from './../../../../../../graphql/helpers/importingHelpers/errorHandler';
import { updateRedisImportData } from './../../../../../../graphql/helpers/importingHelpers/redisHelpers';

export const handleCompletedCreations = async (
  parsedWishlistItem,
  {
    completedCreations,
    existedContact,
    productsMap,
    tenantFilter,
    isRedis,
    generatedRegex,
    spoiledCreations,
  },
) => {
  try {
    // Use prefetched contact data (already includes todos with wishableProduct)
    const existingWishableProductsIds = existedContact?.todos?.map(
      (todo) => todo?.wishableProduct?.id,
    );

    // Use prefetched products map instead of querying (O(1) lookups)
    const productIds = parsedWishlistItem?.products
      ?.map((productId) => productsMap.get(productId))
      .filter(Boolean);

    const newProductIds = productIds
      .filter((product) => !existingWishableProductsIds?.includes(product?.id))
      ?.map((mappedProduct) => mappedProduct?.id);

    // Create all todos in parallel instead of sequentially
    await Promise.all(
      newProductIds.map((productId) =>
        strapi.entityService.create('api::todo.todo', {
          data: {
            contact_id: existedContact.id,
            description: '',
            wishableProduct: productId as ID,
          },
        }),
      ),
    );

    const completedCreationJson = JSON.stringify(parsedWishlistItem);

    if (isRedis) {
      await updateRedisImportData(
        generatedRegex,
        tenantFilter,
        completedCreationJson,
        WISHLIST_IMPORT_IDENTIFIER,
        completedImportingData,
      );
    }

    completedCreations.push(parsedWishlistItem);
  } catch (err) {
    await handleCompletedCreationError({
      parsedEntity: parsedWishlistItem,
      err,
      isRedis,
      generatedRegex,
      tenantFilter,
      functionName: 'handleCompletedWishlistCreations',
      importIdentifier: WISHLIST_IMPORT_IDENTIFIER,
      spoiledCreations,
    });
  }
};
