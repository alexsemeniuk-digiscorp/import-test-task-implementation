import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { handleError, handleLogger } from '../../../helpers/errors';

interface ProductTypeItemCategoryMapping {
  productTypeId: string;
  itemCategoryId: string | null;
}

interface UpdateProductTypesItemCategoriesInput {
  mappings: ProductTypeItemCategoryMapping[];
}

export const updateProductTypesItemCategories: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: UpdateProductTypesItemCategoriesInput }
> = async (root, { input }, ctx) => {
  try {
    const { mappings } = input;

    if (!Array.isArray(mappings) || !mappings.length) {
      return { success: true, updatedCount: 0 };
    }

    const updatePromises = mappings.map((mapping) =>
      strapi.entityService.update(
        'api::product-type.product-type',
        mapping.productTypeId as ID,
        {
          data: {
            itemCategory: (mapping.itemCategoryId as ID) || null,
          },
        },
      ),
    );

    await Promise.all(updatePromises);

    handleLogger(
      'info',
      'updateProductTypesItemCategories',
      `Successfully updated ${mappings.length} product type item categories.`,
    );

    return { success: true, updatedCount: mappings.length };
  } catch (error) {
    handleLogger(
      'error',
      'updateProductTypesItemCategories',
      `Failed to update product type item categories: ${error}`,
    );
    return handleError('updateProductTypesItemCategories', undefined, error);
  }
};
