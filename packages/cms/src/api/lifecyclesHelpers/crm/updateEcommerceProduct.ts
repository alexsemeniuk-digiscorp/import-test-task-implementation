import { shopifyApi } from '../../helpers/shopifyApi';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const updateEcommerceProduct: LifecycleHook = async ({
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
    // Update product details on shopify
    if (ecommerceStores[index]?.ecommerceType === 'shopify') {
      const ecommerceProduct = await strapi.db
        .query('api::ecommerce-product-service.ecommerce-product-service')
        .findOne({
          where: {
            product: product?.id,
            ecommerceType: 'shopify',
          },
        });
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

      const productService = strapi.service('api::product.product');
      if (ecommerceProduct) {
        productService?.syncProductWithShopify(
          locationId,
          ecommerceStores[index]?.storeUrl,
          ecommerceStores[index]?.accessToken,
          product?.id,
          'update',
        );
      }
    }

    // Update product details on woocommerce
    else if (
      ecommerceStores[index]?.ecommerceType === 'woocommerce' &&
      !ecommerceStores[index]?.productWillNotSync
    ) {
      const productService = strapi.service('api::product.product');
      const ecommerceProduct = await strapi.db
        .query('api::ecommerce-product-service.ecommerce-product-service')
        .findOne({
          where: {
            product: product?.id,
            ecommerceType: 'woocommerce',
          },
        });
      if (ecommerceProduct) {
        productService?.syncProductWithWoocommerce(
          ecommerceStores[index]?.storeUrl,
          ecommerceStores[index]?.consumerKey,
          ecommerceStores[index]?.consumerSecret,
          product?.id,
          'update',
        );
      }
    }

    // Update product details on magento
    else if (ecommerceStores[index]?.ecommerceType === 'magento') {
      const productService = strapi.service('api::product.product');
      const ecommerceProduct = await strapi.db
        .query('api::ecommerce-product-service.ecommerce-product-service')
        .findOne({
          where: {
            product: product?.id,
            ecommerceType: 'magento',
          },
        });
      if (ecommerceProduct) {
        productService?.syncProductWithMagento(
          ecommerceStores[index]?.storeUrl,
          ecommerceStores[index]?.accessToken,
          product?.id,
          'update',
        );
      }
    }
  }
};
