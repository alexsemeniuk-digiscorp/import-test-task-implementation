import { GraphQLFieldResolver } from 'graphql';
import { shopifyApi } from '../../../../api/helpers/shopifyApi';
import { woocommerceApi } from '../../../../api/helpers/woocommerceApi';

export const shopifyCollections: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: { tenantId: string; ecommerceType: string } }
> = async (root, { input }) => {
  try {
    const ecommerceStore = await strapi.db
      .query('api::ecommerce-detail.ecommerce-detail')
      .findOne({
        where: { tenant: input?.tenantId, ecommerceType: input?.ecommerceType },
      });

    if (!ecommerceStore) {
      return;
    }

    if (input?.ecommerceType === 'shopify') {
      if (!ecommerceStore?.accessToken || !ecommerceStore?.storeUrl) {
        return;
      }
      const api = shopifyApi(
        ecommerceStore?.storeUrl,
        ecommerceStore?.accessToken,
      );
      const response = await api.get(
        `/admin/api/${process.env.SHOPIFY_API_VERSION}/custom_collections.json`,
      );

      if (!response?.data?.custom_collections) {
        throw new Error('No collections found in Shopify.');
      }
      const collections = response.data.custom_collections.map(
        (collection: { id: string; title: string }) => ({
          id: collection?.id.toString(),
          title: collection?.title,
        }),
      );

      return {
        status: true,
        data: collections,
      };
    } else if (input?.ecommerceType === 'woocommerce') {
      const wooApi = woocommerceApi(
        ecommerceStore?.storeUrl,
        ecommerceStore?.consumerKey,
        ecommerceStore?.consumerSecret,
      );
      const response = await wooApi.get('products/categories');

      const collections = response.data.map(
        (collection: { id: string; name: string }) => ({
          id: collection?.id.toString(),
          title: collection?.name,
        }),
      );

      return {
        status: true,
        data: collections,
      };
    }

    return {
      status: true,
      data: [],
    };
  } catch (error) {
    throw new Error(error);
  }
};
