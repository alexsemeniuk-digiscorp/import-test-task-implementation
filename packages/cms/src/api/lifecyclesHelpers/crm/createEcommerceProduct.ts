import { shopifyApi } from '../../helpers/shopifyApi';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createEcommerceProduct: LifecycleHook = async ({
  result,
  params,
}: AfterLifecycleEvent) => {
  // Skip ecommerce sync during bulk imports for performance
  if (params?.data?._skipEcommerceSync) {
    delete params?.data?._skipEcommerceSync;
    return;
  }

  const product = await strapi.entityService.findOne(
    'api::product.product',
    result?.id,
    {
      fields: ['id', 'isCreatedByOpenApi'],
      populate: {
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  if (product?.isCreatedByOpenApi) {
    return;
  }

  const ecommerceStores = await strapi.entityService.findMany(
    'api::ecommerce-detail.ecommerce-detail',
    {
      filters: {
        tenant: {
          id: {
            $eq: product?.tenant?.id,
          },
        },
      },
      fields: [
        'accessToken',
        'storeUrl',
        'consumerKey',
        'consumerSecret',
        'ecommerceType',
        'productWillNotSync',
      ],
    },
  );

  if (ecommerceStores.length === 0) {
    return null;
  }

  for (let index = 0; index < ecommerceStores?.length; index++) {
    const accessToken = ecommerceStores[index]?.accessToken;
    const productId = product?.id;
    const storeUrl = ecommerceStores[index]?.storeUrl;
    const consumerKey = ecommerceStores[index]?.consumerKey;
    const consumerSecret = ecommerceStores[index]?.consumerSecret;
    const productService = strapi.service('api::product.product');
    if (ecommerceStores[index]?.ecommerceType === 'shopify') {
      const api = shopifyApi(
        ecommerceStores[index].storeUrl,
        ecommerceStores[index].accessToken,
      );

      let locationId;

      try {
        const locationsResponse = await api.get(
          `/admin/api/${process.env.SHOPIFY_API_VERSION}/locations.json`,
        );
        locationId = await locationsResponse?.data?.locations[0]?.id;
      } catch (error) {
        console.error('Shopify locations fetch failed:', error?.response?.data);
        return;
      }

      productService?.syncProductWithShopify(
        locationId,
        storeUrl,
        accessToken,
        productId,
        'create',
      );
    } else if (
      ecommerceStores[index]?.ecommerceType === 'woocommerce' &&
      !ecommerceStores[index]?.productWillNotSync
    ) {
      productService?.syncProductWithWoocommerce(
        storeUrl,
        consumerKey,
        consumerSecret,
        productId,
        'create',
      );
    } else if (ecommerceStores[index]?.ecommerceType === 'magento') {
      productService?.syncProductWithMagento(
        storeUrl,
        accessToken,
        productId,
        'create',
      );
    }
  }
};
