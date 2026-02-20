/**
 * product service
 */
import { factories } from '@strapi/strapi';
import dns from 'dns';
import { handleLogger } from '../../../graphql/helpers/errors';
import { downloadImageToBase64 } from '../../../graphql/models/ecommerceConnection/helpers/downloadImageToBase64';
import { NexusGenEnums } from '../../../types/generated/graphql';
import { entitybatchArrayForWoocommerce } from '../../contact/services/helpers';
import { magentoApi } from '../../helpers/magentoApi';
import { shopifyApi } from '../../helpers/shopifyApi';
import { woocommerceApi } from '../../helpers/woocommerceApi';
import { formatDescriptionToHtml } from '../helpers/helpers';
import { ProductData } from './types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

// Force Node to prefer IPv4 instead of IPv6
dns.setDefaultResultOrder('ipv4first');

export default factories.createCoreService(
  'api::product.product',
  ({ strapi }) => ({
    async getProductInventoryItems(id: number, businessLocationId?: number) {
      return strapi.entityService.findMany(
        'api::product-inventory-item.product-inventory-item',
        {
          filters: {
            product: {
              id: {
                $eq: id,
              },
            },
            ...(businessLocationId && {
              businessLocation: {
                id: {
                  $eq: businessLocationId,
                },
              },
            }),
          },
          populate: [
            'businessLocation',
            'product_inventory_item_events',
            'product',
            'tax',
            'sublocationItems',
            'sublocationItems.sublocation',
          ],
        },
      );
    },
    async getProductGrossMargin(id: number) {
      const productInventoryItems = await this.getProductInventoryItems(id);

      if (!productInventoryItems.length) return 0;

      const productInventoryItemCosts: number[] = (
        await Promise.all(
          productInventoryItems.map((productInventoryItem) => {
            const events = productInventoryItem.product_inventory_item_events;
            const receiveEvents = events?.filter(
              (event) => event?.eventType === 'receive',
            );
            if (receiveEvents.length > 0) {
              return receiveEvents?.[0]?.itemCost;
            } else {
              return undefined;
            }
          }),
        )
      ).filter(Boolean);

      const defaultPrice =
        productInventoryItems?.[0].product.defaultPrice ||
        productInventoryItems?.[0].price;
      const averageItemCost =
        productInventoryItemCosts.length > 0
          ? productInventoryItemCosts.reduce((sum, value) => sum + value, 0) /
            productInventoryItemCosts.length
          : 0;

      return defaultPrice
        ? ((defaultPrice - averageItemCost) / defaultPrice) * 100
        : 0;
    },
    async getTax(id: number, businessLocationId?: number) {
      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      return productInventoryItems?.[0]?.tax?.id ?? undefined;
    },
    async getProductInventoryItemId(id: number, businessLocationId?: number) {
      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      return productInventoryItems?.[0]?.id ?? '';
    },
    async getQuantity(
      id: number,
      businessLocationId?: number,
      sublocationId?: number,
    ) {
      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      if (sublocationId) {
        const quantities: number[] = productInventoryItems?.flatMap(
          (productInventoryItem) =>
            productInventoryItem?.sublocationItems
              ?.filter(
                (sublocationItem) =>
                  sublocationItem?.sublocation?.id === sublocationId,
              )
              ?.map((sublocationItem) => sublocationItem?.quantity ?? 0) || [],
        );

        return quantities.reduce((acc, quantity) => acc + quantity, 0);
      } else {
        const quantities: number[] = await Promise.all(
          productInventoryItems.map(
            (productInventoryItem) => productInventoryItem?.quantity,
          ),
        );

        return quantities.reduce((acc, quantity) => acc + quantity, 0);
      }
    },
    async getQuantityOnOrder(id: number, businessLocationId?: number) {
      const businessLocationFilter = businessLocationId
        ? {
            businessLocation: {
              id: {
                $eq: businessLocationId,
              },
            },
          }
        : {};

      const placedPurchaseOrders = await strapi.entityService.findMany(
        'api::order.order',
        {
          filters: {
            ...businessLocationFilter,
            type: {
              $eq: 'purchase' as NexusGenEnums['ENUM_ORDER_TYPE'],
            },
            status: {
              $eq: 'placed' as NexusGenEnums['ENUM_ORDER_STATUS'],
            },
            products: {
              product: {
                product: {
                  id: {
                    $eq: id,
                  },
                },
              },
            },
          },
          fields: ['id'],
          populate: {
            products: {
              fields: ['quantity'],
              filters: {
                product: {
                  product: {
                    id: {
                      $eq: id,
                    },
                  },
                },
              },
            },
          },
        },
      );

      const quantityOnOrder = placedPurchaseOrders.reduce((sum, order) => {
        const products = order?.products ?? [];
        const orderSum = products.reduce(
          (productSum, product) => productSum + (product?.quantity ?? 0),
          0,
        );
        return sum + orderSum;
      }, 0);

      return quantityOnOrder;
    },
    async getQuantitySold(
      id: number,
      startDate: Date,
      endDate: Date,
      businessLocationId?: number,
    ) {
      const productInventoryItemService = strapi.service(
        'api::product-inventory-item.product-inventory-item',
      );

      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      const quantitiesSold: number[] = await Promise.all(
        productInventoryItems.map((productInventoryItem) =>
          productInventoryItemService.getQuantitySold(
            productInventoryItem?.id,
            startDate,
            endDate,
          ),
        ),
      );

      return quantitiesSold.reduce(
        (acc, quantitySold) => acc + quantitySold,
        0,
      );
    },
    async getSoldRevenue(
      id: number,
      startDate: Date,
      endDate: Date,
      businessLocationId?: number,
    ) {
      const productInventoryItemService = strapi.service(
        'api::product-inventory-item.product-inventory-item',
      );

      const productInventoryItems = await this.getProductInventoryItems(
        id,
        businessLocationId,
      );

      if (!productInventoryItems.length) return 0;

      const soldRevenues: number[] = await Promise.all(
        productInventoryItems.map((productInventoryItem) =>
          productInventoryItemService.getSoldRevenue(
            productInventoryItem?.id,
            startDate,
            endDate,
          ),
        ),
      );

      return soldRevenues.reduce((acc, soldRevenue) => acc + soldRevenue, 0);
    },
    async getNumberLocationsPresented(id: number) {
      const productInventoryItems = await this.getProductInventoryItems(id);

      const locationIds = new Set();

      productInventoryItems.forEach((entry) => {
        locationIds.add(entry.businessLocation.id);
      });

      return Array.from(locationIds)?.length ?? 0;
    },
    async syncProductWithShopify(
      locationId: string,
      shopUrl: string,
      accessToken: string,
      productId: string,
      operationName: string,
      batch: boolean,
    ) {
      if (!accessToken || !shopUrl) {
        return;
      }

      const api = shopifyApi(shopUrl, accessToken);

      let product = await strapi.db.query('api::product.product').findOne({
        where: {
          id: productId,
        },
        populate: ['files', 'tenant', 'weight', 'productType'],
      });

      if (!product) {
        console.error(`Product ${productId} not found`);
        return;
      }

      const productsInventoryItems = await strapi.db
        .query('api::product-inventory-item.product-inventory-item')
        .findMany({
          where: {
            product: product?.id,
          },
        });

      const productQuantity = await productsInventoryItems?.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const productType = await strapi.db
        .query('api::product-type.product-type')
        .findOne({
          where: {
            id: product.productType?.id,
          },
        });

      // If creating and images are likely attached just after the product, wait briefly for them
      if (operationName === 'create' && !batch) {
        const maxAttempts = 8; // ~16s total
        const waitMs = 2000;
        let attempt = 0;
        while (
          (!product?.files || product?.files?.length === 0) &&
          attempt < maxAttempts
        ) {
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          product = await strapi.db.query('api::product.product').findOne({
            where: { id: productId },
            populate: ['files', 'tenant', 'weight', 'productType'],
          });
          attempt++;
        }
      }

      const raw = product?.ecommerceDescription ?? '';
      const html = formatDescriptionToHtml(raw);

      // Filter only image files that Shopify accepts by extension
      const allowedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const validImages =
        product?.files
          ?.filter((file) => {
            try {
              const fileExtension = file.url.split('.').pop().toLowerCase();
              return allowedImageFormats.includes(fileExtension);
            } catch (_e) {
              return false;
            }
          })
          .map((file: { url: string }) => ({ src: file?.url })) || [];

      const productData = {
        product: {
          title: product?.ecommerceName || product?.name,
          body_html: html,
          images: validImages,
          variants: [
            {
              price: product?.defaultPrice,
              sku: product?.SKU,
              barcode: product?.barcode,
              weight: product?.weight?.value,
            },
          ],
          status: product?.active ? 'active' : 'draft',
          product_type: productType?.name,
          tags: product?.shopifyTags,
          metafields: [
            {
              key: 'caratiqProductId',
              value: product?.id,
              type: 'single_line_text_field',
              namespace: 'global',
            },
            {
              key: 'caratiqTenantId',
              value: product?.tenant?.id,
              type: 'single_line_text_field',
              namespace: 'global',
            },
          ],
        },
      };

      try {
        let productResponse;
        let inventoryItemId;
        let shopifyProductId;
        let variantId;
        let ecommerceProduct;
        let existingVariant;

        if (operationName === 'create') {
          const query = `
            query findVariantByBarcode($barcode: String!) {
              productVariants(first: 1, query: $barcode) {
                edges {
                  node {
                    id
                    sku
                    barcode
                    product {
                      id
                      title
                    }
                    inventoryItem {
                      id
                    }
                  }
                }
              }
            }
          `;

          try {
            const response = await api.post(
              `/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
              {
                query,
                variables: {
                  barcode: `barcode:${product?.barcode}`,
                },
              },
            );

            existingVariant =
              response?.data?.data?.productVariants?.edges[0]?.node;

            if (existingVariant) {
              // ========== LINKING EXISTING PRODUCT ==========
              const shopifyProductGid = existingVariant.product.id;
              shopifyProductId = shopifyProductGid.split('/').pop();

              const shopifyInventoryItemGid = existingVariant.inventoryItem.id;
              inventoryItemId = shopifyInventoryItemGid.split('/').pop();

              const shopifyVariantGid = existingVariant.id;
              variantId = shopifyVariantGid.split('/').pop();

              // Check if ecommerce-product-service already exists
              const existingEcommerceProduct = await strapi.db
                .query(
                  'api::ecommerce-product-service.ecommerce-product-service',
                )
                .findOne({
                  where: {
                    product: product?.id,
                    ecommerceType: 'shopify',
                  },
                });

              // Only create if it doesn't exist, otherwise update
              if (!existingEcommerceProduct) {
                await strapi.entityService.create(
                  'api::ecommerce-product-service.ecommerce-product-service',
                  {
                    data: {
                      ecommerceProductId: shopifyProductId.toString(),
                      ecommerceType: 'shopify',
                      isSynced: true,
                      syncDate: new Date(),
                      product: product,
                      tenantId: product?.tenant?.id?.toString(),
                      inventoryItemId: inventoryItemId.toString(),
                    },
                  },
                );
              } else {
                // Update the existing record with the latest data
                await strapi.db
                  .query(
                    'api::ecommerce-product-service.ecommerce-product-service',
                  )
                  .update({
                    where: { id: existingEcommerceProduct.id },
                    data: {
                      ecommerceProductId: shopifyProductId.toString(),
                      isSynced: true,
                      syncDate: new Date(),
                      inventoryItemId: inventoryItemId.toString(),
                    },
                  });
              }

              await new Promise((r) => setTimeout(r, 300));

              // Fetch the full product details
              productResponse = await api.get(
                `/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${shopifyProductId}.json`,
              );

              // Update the linked product with metafields and other data
              const updateData = {
                product: {
                  title: product?.ecommerceName || product?.name,
                  body_html: html,
                  status: product?.active ? 'active' : 'draft',
                  product_type: productType?.name,
                  tags: product?.shopifyTags,
                  metafields: [
                    {
                      key: 'caratiqProductId',
                      value: product?.id,
                      type: 'single_line_text_field',
                      namespace: 'global',
                    },
                    {
                      key: 'caratiqTenantId',
                      value: product?.tenant?.id,
                      type: 'single_line_text_field',
                      namespace: 'global',
                    },
                  ],
                },
              };

              productResponse = await api.put(
                `/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${shopifyProductId}.json`,
                updateData,
              );

              await new Promise((r) => setTimeout(r, 300));

              // Update the variant with our data
              if (variantId) {
                await api.put(
                  `/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variantId}.json`,
                  {
                    variant: {
                      price: product?.defaultPrice,
                      sku: product?.SKU,
                      barcode: product?.barcode,
                      weight: product?.weight?.value,
                      inventory_management: 'shopify',
                      inventory_policy: product?.isNegativeCount
                        ? 'continue'
                        : 'deny',
                    },
                  },
                );
                await new Promise((r) => setTimeout(r, 300));
              }

              // Sync inventory quantity from Carat to Shopify when linking
              if (inventoryItemId) {
                const inventoryLevelUrl = `/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`;
                const inventoryData = {
                  location_id: locationId,
                  inventory_item_id: inventoryItemId,
                  available: productQuantity,
                };
                await api.post(inventoryLevelUrl, inventoryData);
                await new Promise((r) => setTimeout(r, 300));
              }
            } else {
              // ========== CREATING NEW PRODUCT ==========
              productResponse = await api.post(
                `/admin/api/${process.env.SHOPIFY_API_VERSION}/products.json`,
                productData,
              );

              if (productResponse?.data?.product) {
                shopifyProductId = productResponse.data.product.id;
                variantId = productResponse.data.product.variants[0]?.id;
                inventoryItemId =
                  productResponse.data.product.variants[0]?.inventory_item_id;

                // Check if ecommerce-product-service already exists before creating
                const existingEcommerceProduct = await strapi.db
                  .query(
                    'api::ecommerce-product-service.ecommerce-product-service',
                  )
                  .findOne({
                    where: {
                      product: product?.id,
                      ecommerceType: 'shopify',
                    },
                  });

                if (!existingEcommerceProduct) {
                  await strapi.entityService.create(
                    'api::ecommerce-product-service.ecommerce-product-service',
                    {
                      data: {
                        ecommerceProductId: shopifyProductId.toString(),
                        ecommerceType: 'shopify',
                        isSynced: true,
                        syncDate: new Date(),
                        product: product,
                        tenantId: product?.tenant?.id?.toString(),
                        inventoryItemId: inventoryItemId?.toString(),
                      },
                    },
                  );
                } else {
                  // Update the existing record
                  await strapi.db
                    .query(
                      'api::ecommerce-product-service.ecommerce-product-service',
                    )
                    .update({
                      where: { id: existingEcommerceProduct.id },
                      data: {
                        ecommerceProductId: shopifyProductId.toString(),
                        isSynced: true,
                        syncDate: new Date(),
                        inventoryItemId: inventoryItemId?.toString(),
                      },
                    });
                }
              }
            }
          } catch (error) {
            console.error('Shopify product create failed:', error);
            return new Error(error?.response?.message);
          }

          if (product?.shopifyCollections && productResponse?.data?.product) {
            const collectionData = {
              collect: {
                product_id: productResponse.data.product.id,
                collection_id: Number(product.shopifyCollections),
              },
            };
            await api.post(
              `/admin/api/${process.env.SHOPIFY_API_VERSION}/collects.json`,
              collectionData,
            );
            await new Promise((r) => setTimeout(r, 300));
          }
        } else if (operationName === 'update') {
          ecommerceProduct = await strapi.db
            .query('api::ecommerce-product-service.ecommerce-product-service')
            .findOne({
              where: {
                product: product?.id,
                ecommerceType: 'shopify',
              },
            });

          if (!ecommerceProduct?.ecommerceProductId) {
            console.error(`No ecommerce product found for update`);
            return;
          }

          shopifyProductId = ecommerceProduct.ecommerceProductId;
          inventoryItemId = ecommerceProduct.inventoryItemId;

          delete productData.product.images;

          productResponse = await api.put(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${shopifyProductId}.json`,
            productData,
          );

          if (productResponse?.data?.product) {
            variantId = productResponse.data.product.variants[0]?.id;

            // If inventory item ID wasn't stored before, get it now
            if (!inventoryItemId) {
              inventoryItemId =
                productResponse.data.product.variants[0]?.inventory_item_id;

              if (inventoryItemId) {
                await strapi.db
                  .query(
                    'api::ecommerce-product-service.ecommerce-product-service',
                  )
                  .update({
                    where: {
                      id: ecommerceProduct.id,
                    },
                    data: { inventoryItemId: inventoryItemId.toString() },
                  });
              }
            }
          }

          if (product?.shopifyCollections) {
            const collectionId = Number(product.shopifyCollections);
            const productId = productResponse.data.product.id;

            const existingCollects = await api.get(
              `/admin/api/${process.env.SHOPIFY_API_VERSION}/collects.json`,
              {
                params: {
                  product_id: productId,
                },
              },
            );
            await new Promise((r) => setTimeout(r, 300));

            for (const collect of existingCollects?.data?.collects || []) {
              await api.delete(
                `/admin/api/${process.env.SHOPIFY_API_VERSION}/collects/${collect.id}.json`,
              );
            }
            await new Promise((r) => setTimeout(r, 300));

            const collectData = {
              collect: {
                product_id: productId,
                collection_id: collectionId,
              },
            };
            await api.post(
              `/admin/api/${process.env.SHOPIFY_API_VERSION}/collects.json`,
              collectData,
            );
            await new Promise((r) => setTimeout(r, 300));
          }
        } else if (operationName === 'cron') {
          ecommerceProduct = await strapi.db
            .query('api::ecommerce-product-service.ecommerce-product-service')
            .findOne({
              where: {
                product: product?.id,
                ecommerceType: 'shopify',
              },
            });

          if (!ecommerceProduct?.ecommerceProductId) {
            return;
          }

          shopifyProductId = ecommerceProduct.ecommerceProductId;
          inventoryItemId = ecommerceProduct.inventoryItemId;

          productResponse = await api.get(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${shopifyProductId}.json`,
          );

          if (productResponse?.data?.errors) {
            return;
          }

          if (productResponse?.data?.product) {
            variantId = productResponse.data.product.variants[0]?.id;

            // If inventory item ID wasn't stored, get it now
            if (!inventoryItemId) {
              inventoryItemId =
                productResponse.data.product.variants[0]?.inventory_item_id;

              if (inventoryItemId) {
                await strapi.db
                  .query(
                    'api::ecommerce-product-service.ecommerce-product-service',
                  )
                  .update({
                    where: {
                      id: ecommerceProduct.id,
                    },
                    data: { inventoryItemId: inventoryItemId.toString() },
                  });
              }
            }
          }

          await new Promise((r) => setTimeout(r, 300));
        }

        // Update variant inventory settings and quantity for create (new products only), update, and cron operations
        // For linking, inventory was already synced above
        if (
          productResponse?.data?.product &&
          variantId &&
          inventoryItemId &&
          operationName !== 'create'
        ) {
          await api.put(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variantId}.json`,
            {
              variant: {
                inventory_management: 'shopify',
                inventory_policy: product?.isNegativeCount
                  ? 'continue'
                  : 'deny',
              },
            },
          );
          await new Promise((r) => setTimeout(r, 300));

          // Update the inventory level to update the quantity of the product on Shopify
          const inventoryLevelUrl = `/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`;
          const inventoryData = {
            location_id: locationId,
            inventory_item_id: inventoryItemId,
            available: productQuantity,
          };
          await api.post(inventoryLevelUrl, inventoryData);
          await new Promise((r) => setTimeout(r, 300));
        } else if (
          operationName === 'create' &&
          !existingVariant &&
          productResponse?.data?.product &&
          variantId &&
          inventoryItemId
        ) {
          // For newly created products (not linked), sync inventory
          await api.put(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variantId}.json`,
            {
              variant: {
                inventory_management: 'shopify',
                inventory_policy: product?.isNegativeCount
                  ? 'continue'
                  : 'deny',
              },
            },
          );
          await new Promise((r) => setTimeout(r, 300));

          const inventoryLevelUrl = `/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`;
          const inventoryData = {
            location_id: locationId,
            inventory_item_id: inventoryItemId,
            available: productQuantity,
          };
          await api.post(inventoryLevelUrl, inventoryData);
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch (error) {
        return new Error(error?.response?.message);
      }
    },
    async syncProductWithWoocommerce(
      storeUrl: string,
      consumerKey: string,
      consumerSecret: string,
      productId: string,
      operationName: string,
    ) {
      const product = await strapi.db.query('api::product.product').findOne({
        where: {
          id: productId,
        },
        populate: ['files', 'tenant', 'weight', 'productType'],
      });

      if (product?.isCreatedByOpenApi) {
        return;
      }

      const productsInventoryItems = await strapi.db
        .query('api::product-inventory-item.product-inventory-item')
        .findMany({
          where: {
            product: product.id,
          },
        });

      const productQuantity = productsInventoryItems?.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const ecommerceProduct = await strapi.db
        .query('api::ecommerce-product-service.ecommerce-product-service')
        .findOne({
          where: {
            product: product?.id,
            ecommerceType: 'woocommerce',
          },
        });

      const api = woocommerceApi(storeUrl, consumerKey, consumerSecret);

      const allowedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

      const validImages =
        product?.files
          ?.filter((file) => {
            const fileExtension = file.url.split('.').pop().toLowerCase();
            return allowedImageFormats.includes(fileExtension);
          })
          .map((file) => ({ src: file.url })) || [];

      const raw = product?.ecommerceDescription ?? '';
      const html = formatDescriptionToHtml(raw);
      const woocommerceProduct = {
        name: product?.ecommerceName || product?.name,
        regular_price: String(product.defaultPrice),
        manage_stock: true,
        sku: product?.SKU,
        stock_quantity: productQuantity ?? 0,
        tags: product?.shopifyTags
          ? product.shopifyTags.split(',').map((tag) => ({ name: tag.trim() }))
          : [],
        description: html,
        categories: [
          {
            id: product?.woocommerceCategory,
          },
        ],
        images: validImages,
        catalog_visibility: product?.active ? 'visible' : 'hidden',
        backorders: product?.isNegativeCount ? 'yes' : 'no',
        meta_data: [
          {
            key: 'caratiqTenantId',
            value: product?.tenant?.id,
          },
          {
            key: 'caratiqProductId',
            value: product.id,
          },
        ],
      };

      if (!product?.woocommerceCategory) {
        delete woocommerceProduct.categories;
      }

      try {
        if (operationName === 'create') {
          // Check if link already exists in database
          if (ecommerceProduct?.ecommerceProductId) {
            handleLogger(
              'info',
              'Cron :: syncProductWithWoocommerce',
              `Product ${product.id} already linked to WooCommerce product ${ecommerceProduct.ecommerceProductId}`,
            );
            return;
          }

          // Search for existing product by SKU if SKU is present
          let existingWoocommerceProductId = null;

          if (product?.SKU) {
            try {
              const searchResponse = await api.get('products', {
                sku: product.SKU,
              });

              if (searchResponse?.data && searchResponse.data.length > 0) {
                // Product with this SKU already exists in WooCommerce
                existingWoocommerceProductId = searchResponse.data[0].id;
              }
            } catch (searchError) {
              handleLogger(
                'error',
                'Cron :: syncProductWithWoocommerce - SKU search',
                searchError,
              );
              // Continue with creation if search fails
            }
          }

          if (existingWoocommerceProductId) {
            // Update existing WooCommerce product with meta fields
            try {
              await api.put(`products/${existingWoocommerceProductId}`, {
                meta_data: [
                  {
                    key: 'caratiqTenantId',
                    value: product?.tenant?.id,
                  },
                  {
                    key: 'caratiqProductId',
                    value: product.id,
                  },
                ],
              });
            } catch (updateError) {
              handleLogger(
                'error',
                'Cron :: syncProductWithWoocommerce - Update meta fields',
                updateError,
              );
              // Continue with linking even if meta update fails
            }

            // Link existing WooCommerce product instead of creating a new one
            await strapi.entityService.create(
              'api::ecommerce-product-service.ecommerce-product-service',
              {
                data: {
                  ecommerceProductId: existingWoocommerceProductId.toString(),
                  ecommerceType: 'woocommerce',
                  isSynced: true,
                  syncDate: new Date(),
                  product: product.id,
                  tenantId: product?.tenant?.id?.toString(),
                },
              },
            );

            handleLogger(
              'info',
              'Cron :: syncProductWithWoocommerce',
              `Linked existing WooCommerce product ${existingWoocommerceProductId} to CaratIQ product ${product.id}`,
            );
          } else {
            // Create new product in WooCommerce
            const response = await api.post('products', woocommerceProduct);

            await strapi.entityService.create(
              'api::ecommerce-product-service.ecommerce-product-service',
              {
                data: {
                  ecommerceProductId: response?.data?.id.toString(),
                  ecommerceType: 'woocommerce',
                  isSynced: true,
                  syncDate: new Date(),
                  product: product.id,
                  tenantId: product?.tenant?.id?.toString(),
                },
              },
            );

            handleLogger(
              'info',
              'Cron :: syncProductWithWoocommerce',
              `Created new WooCommerce product ${response?.data?.id} for CaratIQ product ${product.id}`,
            );
          }
        }
        if (operationName === 'update') {
          const updatePayload = {
            stock_quantity: productQuantity ?? 0,
          };
          await api.put(
            `products/${ecommerceProduct?.ecommerceProductId}`,
            updatePayload,
          );
        }
      } catch (error) {
        handleLogger(
          'error',
          'Cron :: updateProductInventoryOnEcommerce',
          error,
        );
        return new Error(error);
      }
    },
    async syncProductsBatchWithWoocommerce(
      products,
      storeUrl,
      consumerKey,
      consumerSecret,
    ) {
      const api = woocommerceApi(storeUrl, consumerKey, consumerSecret);
      // Build batches of up to 50 create payloads for WooCommerce batch API
      const batches = entitybatchArrayForWoocommerce(products, 50);

      for (const batch of batches) {
        try {
          // First, check which products are already linked in the database
          const existingLinks = await strapi.db
            .query('api::ecommerce-product-service.ecommerce-product-service')
            .findMany({
              where: {
                product: { $in: batch.map((p) => p.id) },
                ecommerceType: 'woocommerce',
              },
            });

          const linkedProductIds = new Set(
            existingLinks.map((link) => link.product?.id || link.product),
          );

          // Filter out already linked products
          const unlinkedProducts = batch.filter(
            (product) => !linkedProductIds.has(product.id),
          );

          if (unlinkedProducts.length === 0) {
            console.log('All products in this batch are already linked');
            continue;
          }

          // Check for existing products and separate them from new ones
          const productsToCreate = [];
          const existingProductMappings = [];
          const productsToUpdateMeta = [];

          // Collect all SKUs from the batch for bulk search
          const skuMap = new Map();
          const productsWithSKU = [];
          const productsWithoutSKU = [];

          for (const product of unlinkedProducts) {
            if (!product?.SKU) {
              productsWithoutSKU.push(product);
            } else {
              productsWithSKU.push(product);
              skuMap.set(product.SKU, product);
            }
          }

          // Bulk search for existing products by SKU if there are any
          if (productsWithSKU.length > 0) {
            try {
              // Search for all products in WooCommerce with a higher per_page to catch more
              const searchResponse = await api.get('products', {
                per_page: 100, // Adjust based on your needs
                sku: Array.from(skuMap.keys()).join(','), // Some APIs support comma-separated SKUs
              });

              const existingProducts = searchResponse?.data || [];
              const foundSKUs = new Set();

              // Map existing WooCommerce products to Strapi products
              for (const wooProduct of existingProducts) {
                if (wooProduct.sku && skuMap.has(wooProduct.sku)) {
                  foundSKUs.add(wooProduct.sku);
                  const strapiProduct = skuMap.get(wooProduct.sku);
                  existingProductMappings.push({
                    strapiProductId: strapiProduct.id,
                    woocommerceProductId: wooProduct.id,
                    tenantId: strapiProduct?.tenant?.id,
                  });
                  productsToUpdateMeta.push({
                    woocommerceProductId: wooProduct.id,
                    tenantId: strapiProduct?.tenant?.id,
                    productId: strapiProduct.id,
                  });
                }
              }

              // Add products with SKUs that weren't found to the create list
              for (const product of productsWithSKU) {
                if (!foundSKUs.has(product.SKU)) {
                  productsToCreate.push(product);
                }
              }
            } catch (bulkSearchError) {
              console.error(
                'Bulk SKU search failed, falling back to individual checks:',
                bulkSearchError,
              );

              // Fallback: Check each product individually
              for (const product of productsWithSKU) {
                try {
                  const existingProductResponse = await api.get('products', {
                    sku: product.SKU,
                    per_page: 1,
                  });

                  const existingProducts = existingProductResponse?.data || [];

                  if (existingProducts.length > 0) {
                    const existingProduct = existingProducts[0];
                    existingProductMappings.push({
                      strapiProductId: product.id,
                      woocommerceProductId: existingProduct.id,
                      tenantId: product?.tenant?.id,
                    });
                    productsToUpdateMeta.push({
                      woocommerceProductId: existingProduct.id,
                      tenantId: product?.tenant?.id,
                      productId: product.id,
                    });
                  } else {
                    productsToCreate.push(product);
                  }
                } catch (checkError) {
                  console.error(
                    `Error checking SKU ${product.SKU}:`,
                    checkError,
                  );
                  productsToCreate.push(product);
                }
              }
            }
          }

          // Add products without SKU to create list (can't check for duplicates)
          productsToCreate.push(...productsWithoutSKU);

          // Update meta fields for existing WooCommerce products using batch API
          if (productsToUpdateMeta.length > 0) {
            try {
              const metaUpdates = productsToUpdateMeta.map((item) => ({
                id: item.woocommerceProductId,
                meta_data: [
                  { key: 'caratiqTenantId', value: item.tenantId },
                  { key: 'caratiqProductId', value: item.productId },
                ],
              }));

              await api.post('products/batch', {
                update: metaUpdates,
              });

              console.log(
                `Updated meta fields for ${productsToUpdateMeta.length} existing WooCommerce products`,
              );
            } catch (metaUpdateError) {
              console.error(
                'Error updating meta fields in batch:',
                metaUpdateError,
              );
              // Continue with linking even if meta update fails
            }
          }

          // Create database entries for existing products
          for (const mapping of existingProductMappings) {
            try {
              if (
                !mapping?.woocommerceProductId ||
                !mapping?.strapiProductId ||
                !mapping?.tenantId
              )
                continue;

              await strapi.entityService.create(
                'api::ecommerce-product-service.ecommerce-product-service',
                {
                  data: {
                    ecommerceProductId:
                      mapping?.woocommerceProductId?.toString(),
                    ecommerceType: 'woocommerce',
                    isSynced: true,
                    syncDate: new Date(),
                    product: mapping.strapiProductId,
                    tenantId: mapping.tenantId?.toString() || undefined,
                  },
                },
              );
            } catch (dbError) {
              console.error(
                `Error creating database entry for existing product ${mapping.strapiProductId}:`,
                dbError,
              );
            }
          }

          console.log(
            `Linked ${existingProductMappings.length} existing WooCommerce products`,
          );

          // Process products that need to be created in WooCommerce
          if (productsToCreate.length > 0) {
            // Prepare create payloads
            const toCreate = await Promise.all(
              productsToCreate.map(async (product) => {
                const inventoryItems = await strapi.db
                  .query('api::product-inventory-item.product-inventory-item')
                  .findMany({ where: { product: product.id } });

                const productQuantity = inventoryItems?.reduce(
                  (sum, item) => sum + (item?.quantity ?? 0),
                  0,
                );

                const allowedImageFormats = [
                  'jpg',
                  'jpeg',
                  'png',
                  'gif',
                  'webp',
                ];
                const validImages =
                  product?.files
                    ?.filter((file) => {
                      try {
                        const url = file?.url ?? '';
                        const ext = url.split('.').pop()?.toLowerCase();
                        return (
                          Boolean(ext) && allowedImageFormats.includes(ext)
                        );
                      } catch (_e) {
                        return false;
                      }
                    })
                    .map((file) => ({ src: file.url })) || [];

                const raw = product?.ecommerceDescription ?? '';
                const html = formatDescriptionToHtml(raw);

                return {
                  // Keep a pointer to original id for mapping after response
                  __strapiId: product.id,
                  name: product?.ecommerceName || product?.name,
                  regular_price: String(product.defaultPrice),
                  manage_stock: true,
                  sku: product?.SKU,
                  stock_quantity: productQuantity ?? 0,
                  tags: product?.shopifyTags
                    ? product.shopifyTags
                        .split(',')
                        .map((tag) => ({ name: tag.trim() }))
                    : [],
                  description: html,
                  images: validImages,
                  catalog_visibility: product?.active ? 'visible' : 'hidden',
                  backorders: product?.isNegativeCount ? 'yes' : 'no',
                  meta_data: [
                    { key: 'caratiqTenantId', value: product?.tenant?.id },
                    { key: 'caratiqProductId', value: product.id },
                  ],
                } as any;
              }),
            );

            // Use WooCommerce batch create endpoint
            const response = await api.post('products/batch', {
              create: toCreate.map(({ __strapiId, ...rest }) => rest),
            });

            const created = response?.data?.create || [];

            // Persist mapping for created items
            for (let i = 0; i < created.length; i++) {
              const createdItem = created[i];
              const source = toCreate[i];
              if (!createdItem?.id || !source?.__strapiId) continue;
              await strapi.entityService.create(
                'api::ecommerce-product-service.ecommerce-product-service',
                {
                  data: {
                    ecommerceProductId: createdItem.id.toString(),
                    ecommerceType: 'woocommerce',
                    isSynced: true,
                    syncDate: new Date(),
                    product: source.__strapiId,
                    tenantId:
                      (createdItem?.meta_data || [])
                        ?.find((m) => m?.key === 'caratiqTenantId')
                        ?.value?.toString() || undefined,
                  },
                },
              );
            }

            console.log(`Created ${created.length} new WooCommerce products`);
          }
        } catch (error) {
          console.error(
            'Error syncing product batch:',
            error?.response?.data || error,
          );
        }
      }
    },
    async syncProductWithMagento(
      storeUrl: string,
      accessToken: string,
      productId: string,
      operationName: string,
    ) {
      const product = await strapi.db.query('api::product.product').findOne({
        where: {
          id: productId,
        },
        populate: ['files', 'tenant', 'weight', 'productType'],
      });

      if (product?.isCreatedByOpenApi) {
        return;
      }

      const productsInventoryItems = await strapi.db
        .query('api::product-inventory-item.product-inventory-item')
        .findMany({
          where: {
            product: product.id,
          },
        });
      const productQuantity = productsInventoryItems?.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const productData: ProductData = {
        product: {
          sku: product.SKU ?? product?.id,
          name: product?.ecommerceName ?? product?.name,
          attribute_set_id: 4,
          price: product.defaultPrice,
          status: 1,
          visibility: product?.active ? 4 : 1,
          type_id: 'simple',
          extension_attributes: {
            stock_item: {
              qty: productQuantity,
              is_in_stock: true,
              backorders: product?.isNegativeCount ? 1 : 0,
            },
          },
        },
      };

      if (product?.files?.length > 0) {
        productData.product.media_gallery_entries = [];

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        for (let i = 0; i < product.files.length; i++) {
          const file = product.files[i];
          const { base64: imageBase64, mimeType } = await downloadImageToBase64(
            file?.url,
          );

          if (imageBase64 && allowedMimeTypes.includes(mimeType)) {
            const fileExtension = mime.extension(mimeType);
            productData.product.media_gallery_entries.push({
              media_type: 'image',
              label: `Product Image ${i + 1}`,
              position: i + 1,
              disabled: false,
              types: i === 0 ? ['image', 'small_image', 'thumbnail'] : [],
              file: `/${product.sku}_${i + 1}.${fileExtension}`,
              content: {
                base64EncodedData: imageBase64,
                type: mimeType,
                name: `${product.sku}_${i + 1}.${fileExtension}`,
              },
            });
          }
        }
      }

      const api = magentoApi(storeUrl, accessToken);
      try {
        if (operationName === 'create') {
          let response;
          try {
            response = await api.post(`/products`, productData);
            if (response) {
              strapi.entityService.create(
                'api::ecommerce-product-service.ecommerce-product-service',
                {
                  data: {
                    ecommerceProductId: response?.data?.sku.toString(),
                    ecommerceType: 'magento',
                    isSynced: true,
                    syncDate: new Date(),
                    product: product,
                    tenantId: product?.tenant?.id?.toString(),
                  },
                },
              );
            }
          } catch (error) {
            return new Error(error);
          }
        } else if (operationName === 'update') {
          const ecommerceProduct = await strapi.db
            .query('api::ecommerce-product-service.ecommerce-product-service')
            .findOne({
              where: {
                product: product?.id,
                ecommerceType: 'magento',
              },
            });
          try {
            if (ecommerceProduct) {
              await api.put(
                `/products/${ecommerceProduct?.ecommerceProductId}`,
                productData,
              );
            }
          } catch (error) {
            return new Error(error);
          }
        }
      } catch (error) {
        return new Error(error);
      }
    },
    async updateProductStockBatchWithWoocommerce(
      products,
      storeUrl,
      consumerKey,
      consumerSecret,
    ) {
      const api = woocommerceApi(storeUrl, consumerKey, consumerSecret);
      const batchProducts = entitybatchArrayForWoocommerce(products, 50);

      for (const batch of batchProducts) {
        try {
          // Prepare product stock updates
          const productStockDataBatch = await Promise.all(
            batch.map(async (product) => {
              const quantity = (product.productInventoryItems ?? []).reduce(
                (sum, item) => sum + (item.quantity ?? 0),
                0,
              );
              // Find WooCommerce product service entry
              const ecommerceService = product.ecommerceProductServices.filter(
                (service) => service.ecommerceType === 'woocommerce',
              )[0];

              if (!ecommerceService?.ecommerceProductId) {
                return null; // skip if not synced
              }

              return {
                id: ecommerceService?.ecommerceProductId,
                stock_quantity: quantity ?? 0,
              };
            }),
          );

          // Filter out nulls
          const validStockUpdates = productStockDataBatch.filter(Boolean);

          if (validStockUpdates.length > 0) {
            const response = await api.post('products/batch', {
              update: validStockUpdates,
            });

            // Update sync timestamp
            for (const updatedProduct of response?.data?.update || []) {
              if (!updatedProduct?.id) continue;
              await strapi.db
                .query(
                  'api::ecommerce-product-service.ecommerce-product-service',
                )
                .update({
                  where: { ecommerceProductId: updatedProduct?.id?.toString() },
                  data: {
                    syncDate: new Date(),
                  },
                });
            }
          }
        } catch (error) {
          console.error('Error updating product stock batch:', error);
        }
      }
    },
    async updateProductStockOneByOne(
      products,
      storeUrl,
      accessToken,
      locationId,
    ) {
      if (!accessToken || !storeUrl) {
        return;
      }
      console.log(
        storeUrl,
        accessToken,
        locationId,
        products,
        'storeUrl, accessToken, locationId',
      );
      const api = shopifyApi(storeUrl, accessToken);
      let totalSynced = 0;
      const failed = [];

      for (const product of products) {
        try {
          const quantity = (product.productInventoryItems ?? []).reduce(
            (sum, item) => sum + (item.quantity ?? 0),
            0,
          );

          // 2. Get ecommerce mapping
          const ecommerceProduct = await strapi.db
            .query('api::ecommerce-product-service.ecommerce-product-service')
            .findOne({
              where: {
                product: product.id,
                ecommerceType: 'shopify',
                isSynced: true,
              },
              select: ['ecommerceProductId', 'inventoryItemId'],
            });

          if (!ecommerceProduct?.ecommerceProductId) {
            failed.push({ productId: product.id, error: 'Mapping not found' });
            continue;
          }

          let inventoryItemId = ecommerceProduct?.inventoryItemId;

          // 3. If no inventoryItemId, fetch variant from Shopify
          if (!inventoryItemId) {
            const productResponse = await api.get(
              `/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${ecommerceProduct.ecommerceProductId}.json`,
            );
            const variant = productResponse?.data?.product?.variants?.[0];
            if (!variant?.inventory_item_id) {
              failed.push({
                productId: product.id,
                error: 'No variant inventory_item_id',
              });
              continue;
            }

            // Ensure inventory management is set
            await api.put(
              `/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variant.id}.json`,
              {
                variant: {
                  inventory_management: 'shopify',
                  inventory_policy: product?.isNegativeCount
                    ? 'continue'
                    : 'deny',
                },
              },
            );

            inventoryItemId = variant.inventory_item_id;
            // Small delay after variant update
            await new Promise((r) => setTimeout(r, 1000));
          }

          // 4. Update inventory level (REST API)
          const payload = {
            location_id: locationId,
            inventory_item_id: inventoryItemId,
            available: quantity,
          };

          console.log(payload, 'inventory update payload');

          const response = await api.post(
            `/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels/set.json`,
            payload,
          );

          if (response.data?.errors) {
            failed.push({
              productId: product.id,
              error: JSON.stringify(response.data.errors),
            });
          }

          totalSynced++;
        } catch (err) {
          failed.push({ productId: product.id, error: err.message });
        }

        // ✅ wait 1s before next update to avoid rate-limit
        await new Promise((r) => setTimeout(r, 1000));
      }

      const result = {
        message: `Finished: ${totalSynced} products synced, ${failed.length} failed.`,
        failures: failed,
      };
      console.error('Shopify error:', result);

      return result;
    },
  }),
);
