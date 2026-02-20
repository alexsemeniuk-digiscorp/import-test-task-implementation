import { handleError } from './../../../../../helpers/errors';
import { filterEmpty } from './../../../../product/helpers/importing/productImport';

export const checkAllProductsExist = async (products) => {
  try {
    const productsSet = new Set(products);

    const existingProductsIds = await strapi.entityService.findMany(
      'api::product.product',
      {
        filters: {
          productId: {
            $in: Array.from(productsSet) as string[],
          },
        },
        fields: ['id'],
      },
    );

    return (
      filterEmpty(Array.from(productsSet)).length ===
      existingProductsIds?.length
    );
  } catch (e) {
    handleError('checkAllBusinessLocationsExist', undefined, e);
  }
};
