import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { generateId } from '../../../../utils/randomBytes';
import { handleError, handleLogger } from '../../../helpers/errors';
import {
  DEFAULT_MEMO_DAYS,
  addDaysToDateAsDate,
  getDaysDifference,
} from '../../../helpers/getDaysDifference';
import { getOrderTypeData } from '../../../helpers/getOrderTypeData';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { NexusGenInputs } from './../../../../types/generated/graphql';

export const createProductsBasedOnAIGeneration: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: NexusGenInputs['CreateProductsBasedOnAIGenerationInput'] }
> = async (root, { input }, ctx) => {
  const userId = ctx?.state?.user?.id;
  const tenantFilter = await getTenantFilter(userId);

  try {
    const {
      products,
      orderId,
      businessLocationId,
      orderType,
      isAiProductExpected,
    } = input;

    if (!Array.isArray(products) || !products.length) {
      throw new Error('No products provided');
    }

    const existingProducts = await strapi.entityService.findMany(
      'api::product.product',
      {
        filters: {
          tenant: tenantFilter.tenant,
          or: [
            { name: { $in: products.map((p) => p.name).filter(Boolean) } },
            { SKU: { $in: products.map((p) => p.SKU).filter(Boolean) } },
          ],
        },
        fields: ['id', 'name', 'SKU'],
      },
    );

    const existingNames = new Set(
      existingProducts
        .map((p) => p.name?.trim()?.toLowerCase())
        .filter(Boolean),
    );
    const existingSKUs = new Set(
      existingProducts.map((p) => p.SKU?.trim()?.toLowerCase()).filter(Boolean),
    );

    const newProducts = products.filter((p) => {
      const name = p?.name?.trim()?.toLowerCase();
      const sku = p?.SKU?.trim()?.toLowerCase();
      return !(existingNames.has(name) || existingSKUs.has(sku));
    });

    if (!newProducts.length || !businessLocationId) {
      return [];
    }

    const { isSellingOrder, isTradeInOrder, isPurchaseOrder } =
      getOrderTypeData(orderType);

    const businessLocations = await strapi.entityService.findMany(
      'api::business-location.business-location',
      {
        filters: { tenant: tenantFilter.tenant },
        fields: ['id'],
        populate: {
          tax: {
            fields: ['id'],
          },
          taxCollection: {
            fields: ['id'],
          },
        },
      },
    );

    const productSetting = await strapi.entityService.findMany(
      'api::product-setting.product-setting',
      {
        filters: {
          tenant: {
            id: {
              $eq: tenantFilter.tenant,
            },
          },
        },
        fields: [
          'id',
          'returnableItem',
          'allowNegativeQuantity',
          'visibleItem',
        ],
      },
    );

    if (isPurchaseOrder && isAiProductExpected) {
      // Case 1: Purchase order with AI products
      const createdProducts = await Promise.all(
        newProducts.map(async (product) => {
          let weightId = null;

          if (product?.weight && product?.unit) {
            const createdWeight = await strapi.entityService.create(
              'api::weight.weight',
              {
                data: {
                  value: product.weight,
                  unit: product.unit,
                },
              },
            );
            weightId = createdWeight.id;
          }

          const createdProduct = await strapi.entityService.create(
            'api::product.product',
            {
              data: {
                name: product?.name || '',
                SKU: product?.SKU || '',
                defaultPrice: product?.defaultPrice || 0,
                note: product?.note || '',
                barcode: product?.barcode || '',
                tenant: tenantFilter.tenant,
                weight: weightId,
                brand: product?.brand as ID,
                productType: product?.productType as ID,
                returnable: productSetting?.[0]?.returnableItem ?? false,
                isNegativeCount: true,
                active: productSetting?.[0]?.visibleItem ?? true,
                tagProductName: product?.tagProductName || '',
                ecommerceName: product?.ecommerceName || '',
                shopifyTags: product?.shopifyTags || '',
                appraisalDescription: product?.appraisalDescription || '',
                ecommerceDescription: product?.ecommerceDescription || '',
              },
            },
          );

          let targetInventoryItem = null;

          await Promise.all(
            businessLocations.map(async (location) => {
              const item = await strapi.entityService.create(
                'api::product-inventory-item.product-inventory-item',
                {
                  data: {
                    product: createdProduct.id,
                    businessLocation: location.id,
                    quantity: 0,
                    price: 0,
                    tenant: tenantFilter.tenant,
                    tax: location?.tax?.id || null,
                  },
                },
              );

              if (Number(location.id) === Number(businessLocationId)) {
                targetInventoryItem = item;
              }

              return item;
            }),
          );

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: targetInventoryItem?.uuid,
                price: product.cost ?? 0,
                quantity: product?.quantity ? Number(product?.quantity) : 1,
                product: targetInventoryItem?.id,
                purchaseType: 'buy',
                order: orderId as ID,
              },
            },
          );

          return createdProduct;
        }),
      );

      handleLogger(
        'info',
        'createProductsBasedOnAIGeneration',
        'New products in purchase AI order successfully created.',
      );

      return createdProducts.map((item) => item.id);
    } else if (isPurchaseOrder && !isAiProductExpected) {
      // Case 2: Purchase order without AI products
      const createdProducts = await Promise.all(
        newProducts.map(async (product) => {
          let weightId = null;

          if (product?.weight && product?.unit) {
            const createdWeight = await strapi.entityService.create(
              'api::weight.weight',
              {
                data: {
                  value: product.weight,
                  unit: product.unit,
                },
              },
            );
            weightId = createdWeight.id;
          }

          const createdProduct = await strapi.entityService.create(
            'api::product.product',
            {
              data: {
                name: product?.name || '',
                SKU: product?.SKU || '',
                defaultPrice: product?.defaultPrice || 0,
                note: product?.note || '',
                barcode: product?.barcode || '',
                tenant: tenantFilter.tenant,
                weight: weightId,
                brand: product?.brand as ID,
                productType: product?.productType as ID,
                returnable: productSetting?.[0]?.returnableItem ?? false,
                isNegativeCount: true,
                active: productSetting?.[0]?.visibleItem ?? true,
                tagProductName: product?.tagProductName || '',
                ecommerceName: product?.ecommerceName || '',
                shopifyTags: product?.shopifyTags || '',
                appraisalDescription: product?.appraisalDescription || '',
                ecommerceDescription: product?.ecommerceDescription || '',
              },
            },
          );

          let targetInventoryItem = null;

          await Promise.all(
            businessLocations.map(async (location) => {
              const isTargetLocation =
                Number(location.id) === Number(businessLocationId);
              const item = await strapi.entityService.create(
                'api::product-inventory-item.product-inventory-item',
                {
                  data: {
                    product: createdProduct.id,
                    businessLocation: location.id,
                    quantity: isTargetLocation
                      ? product?.quantity
                        ? Number(product?.quantity)
                        : 0
                      : 0,
                    price: isTargetLocation ? product?.defaultPrice || 0 : 0,
                    tenant: tenantFilter.tenant,
                    tax: location?.tax?.id || null,
                  },
                },
              );

              if (isTargetLocation) {
                targetInventoryItem = item;
              }

              return item;
            }),
          );

          if (!(product.itemContactVendor || product.itemCompanyVendor))
            return createdProduct;

          const orderRegexedId = generateId();

          const memoExpiryDate = product?.memo
            ? product?.expiryDate
              ? new Date(product?.expiryDate)
              : addDaysToDateAsDate(
                  new Date(product?.receiveDate),
                  DEFAULT_MEMO_DAYS,
                )
            : null;

          const purchaseOrder = await strapi.entityService.create(
            'api::order.order',
            {
              data: {
                orderId: orderRegexedId,
                status: 'started',
                businessLocation: businessLocationId as ID,
                total: 0,
                subTotal: 0,
                discount: 0,
                tax: 0,
                type: 'purchase',
                ...(product.itemContactVendor && {
                  contact: product.itemContactVendor as ID,
                }),
                ...(product.itemCompanyVendor && {
                  company: product.itemCompanyVendor as ID,
                }),
                ...(product.sales && {
                  sales: product.sales as ID,
                }),
                customCreationDate: new Date(product?.receiveDate) || null,
                memo: product?.memo
                  ? product?.expiryDate
                    ? getDaysDifference(
                        product?.receiveDate,
                        product?.expiryDate,
                      )
                    : DEFAULT_MEMO_DAYS
                  : null,
                receiveDate: new Date(product?.receiveDate) || null,
                tenant: tenantFilter.tenant,
                inputInvoiceNum: product?.vendorInvoice || null,
              },
            },
          );

          await strapi.entityService.create(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              data: {
                eventType: 'receive',
                change: (product?.quantity
                  ? Number(product?.quantity)
                  : 0
                ).toString(),
                remainingQuantity: product?.quantity
                  ? Number(product?.quantity)
                  : 0,
                productInventoryItem: targetInventoryItem?.id,
                ...(product.sales && {
                  addedBy: product.sales as ID,
                }),
                tenant: tenantFilter.tenant,
                itemCost: product.cost ?? 0,
                ...(product.itemContactVendor && {
                  itemContactVendor: product.itemContactVendor as ID,
                }),
                ...(product.itemCompanyVendor && {
                  itemVendor: product.itemCompanyVendor as ID,
                }),
                memo: product?.memo || false,
                expiryDate: memoExpiryDate,
                receiveDate: new Date(product?.receiveDate) || null,
                businessLocation: businessLocationId as ID,
                order: purchaseOrder?.id,
              },
            },
          );

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: targetInventoryItem?.uuid,
                price: product.cost ?? 0,
                quantity: product?.quantity ? Number(product?.quantity) : 0,
                product: targetInventoryItem?.id,
                purchaseType: 'buy',
                order: purchaseOrder?.id,
              },
            },
          );

          const updatedPurchaseOrder = await strapi.entityService.update(
            'api::order.order',
            purchaseOrder?.id,
            {
              data: {
                status: 'received',
                billCreation: false,
              },
            },
          );

          await strapi.entityService.update(
            'api::order.order',
            purchaseOrder?.id,
            {
              data: {
                tax: 0,
                total: updatedPurchaseOrder.subTotal,
                billCreation: true,
                receiveDate: new Date(product?.receiveDate) || null,
                paid: product?.paid || false,
              },
            },
          );

          return createdProduct;
        }),
      );

      handleLogger(
        'info',
        'createProductsBasedOnAIGeneration',
        'New products in purchase order successfully created.',
      );

      return createdProducts.map((item) => item.id);
    } else if (isTradeInOrder) {
      // Case 3: Trade in order
      const createdProducts = await Promise.all(
        newProducts.map(async (product) => {
          let weightId = null;

          if (product?.weight && product?.unit) {
            const createdWeight = await strapi.entityService.create(
              'api::weight.weight',
              {
                data: {
                  value: product.weight,
                  unit: product.unit,
                },
              },
            );
            weightId = createdWeight.id;
          }

          const createdProduct = await strapi.entityService.create(
            'api::product.product',
            {
              data: {
                name: product?.name || '',
                SKU: product?.SKU || '',
                defaultPrice: product?.defaultPrice || 0,
                note: product?.note || '',
                barcode: product?.barcode || '',
                tenant: tenantFilter.tenant,
                weight: weightId,
                brand: product?.brand as ID,
                productType: product?.productType as ID,
                returnable: productSetting?.[0]?.returnableItem ?? false,
                isNegativeCount: true,
                active: productSetting?.[0]?.visibleItem ?? true,
                tagProductName: product?.tagProductName || '',
                ecommerceName: product?.ecommerceName || '',
                shopifyTags: product?.shopifyTags || '',
                appraisalDescription: product?.appraisalDescription || '',
                ecommerceDescription: product?.ecommerceDescription || '',
              },
            },
          );

          let targetInventoryItem = null;

          await Promise.all(
            businessLocations.map(async (location) => {
              const item = await strapi.entityService.create(
                'api::product-inventory-item.product-inventory-item',
                {
                  data: {
                    product: createdProduct.id,
                    businessLocation: location.id,
                    quantity: 0,
                    price: 0,
                    tenant: tenantFilter.tenant,
                    tax: location?.tax?.id || null,
                  },
                },
              );

              if (Number(location.id) === Number(businessLocationId)) {
                targetInventoryItem = item;
              }

              return item;
            }),
          );

          const currentTradeInOrder = await strapi.entityService.findMany(
            'api::order.order',
            {
              filters: {
                orderId: orderId,
                tenant: {
                  id: {
                    $eq: tenantFilter.tenant,
                  },
                },
              },
              fields: ['id'],
            },
          );

          if (!currentTradeInOrder?.[0]?.id) return;

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: targetInventoryItem?.uuid,
                price: product.cost ?? 0,
                quantity: product?.quantity ? Number(product?.quantity) : 1,
                product: targetInventoryItem?.id,
                purchaseType: 'buy',
                order: currentTradeInOrder?.[0]?.id,
              },
            },
          );

          return createdProduct;
        }),
      );

      handleLogger(
        'info',
        'createProductsBasedOnAIGeneration',
        'New products in trade in order successfully created.',
      );

      return createdProducts.map((item) => item.id);
    } else if (isSellingOrder) {
      // Case 4: Selling order
      const createdProducts = await Promise.all(
        newProducts.map(async (product) => {
          let weightId = null;

          if (product?.weight && product?.unit) {
            const createdWeight = await strapi.entityService.create(
              'api::weight.weight',
              {
                data: {
                  value: product.weight,
                  unit: product.unit,
                },
              },
            );
            weightId = createdWeight.id;
          }

          const createdProduct = await strapi.entityService.create(
            'api::product.product',
            {
              data: {
                name: product?.name || '',
                SKU: product?.SKU || '',
                defaultPrice: product?.defaultPrice || 0,
                note: product?.note || '',
                barcode: product?.barcode || '',
                tenant: tenantFilter.tenant,
                weight: weightId,
                brand: product?.brand as ID,
                productType: product?.productType as ID,
                returnable: productSetting?.[0]?.returnableItem ?? false,
                isNegativeCount: true,
                active: productSetting?.[0]?.visibleItem ?? true,
                tagProductName: product?.tagProductName || '',
                ecommerceName: product?.ecommerceName || '',
                shopifyTags: product?.shopifyTags || '',
                appraisalDescription: product?.appraisalDescription || '',
                ecommerceDescription: product?.ecommerceDescription || '',
              },
            },
          );

          let targetInventoryItem = null;
          let targetLocationTaxId = null;
          let targetLocationTaxCollectionId = null;

          await Promise.all(
            businessLocations.map(async (location) => {
              const isTargetLocation =
                Number(location.id) === Number(businessLocationId);
              const item = await strapi.entityService.create(
                'api::product-inventory-item.product-inventory-item',
                {
                  data: {
                    product: createdProduct.id,
                    businessLocation: location.id,
                    quantity: isTargetLocation
                      ? product?.quantity
                        ? Number(product?.quantity)
                        : 0
                      : 0,
                    price: isTargetLocation ? product?.defaultPrice || 0 : 0,
                    tenant: tenantFilter.tenant,
                    tax: location?.tax?.id || null,
                  },
                },
              );

              if (isTargetLocation) {
                targetInventoryItem = item;
                targetLocationTaxId = location?.tax?.id || null;
                targetLocationTaxCollectionId =
                  location?.taxCollection?.id || null;
              }

              return item;
            }),
          );

          if (!(product.itemContactVendor || product.itemCompanyVendor)) {
            const currentSellingOrder = await strapi.entityService.findMany(
              'api::order.order',
              {
                filters: {
                  orderId: orderId,
                  tenant: {
                    id: {
                      $eq: tenantFilter.tenant,
                    },
                  },
                },
                fields: ['id'],
              },
            );

            if (!currentSellingOrder?.[0]?.id) return createdProduct;

            await strapi.entityService.create(
              'api::product-order-item.product-order-item',
              {
                data: {
                  itemId: targetInventoryItem?.uuid,
                  price: product?.defaultPrice ?? 0,
                  quantity: 1,
                  product: targetInventoryItem?.id,
                  purchaseType: 'buy',
                  order: currentSellingOrder?.[0]?.id,
                  tax: targetLocationTaxId,
                  taxCollection: targetLocationTaxCollectionId,
                },
              },
            );

            return createdProduct;
          }

          const orderRegexedId = generateId();

          const memoExpiryDate = product?.memo
            ? product?.expiryDate
              ? new Date(product?.expiryDate)
              : addDaysToDateAsDate(
                  new Date(product?.receiveDate),
                  DEFAULT_MEMO_DAYS,
                )
            : null;

          const purchaseOrder = await strapi.entityService.create(
            'api::order.order',
            {
              data: {
                orderId: orderRegexedId,
                status: 'started',
                businessLocation: businessLocationId as ID,
                total: 0,
                subTotal: 0,
                discount: 0,
                tax: 0,
                type: 'purchase',
                ...(product.itemContactVendor && {
                  contact: product.itemContactVendor as ID,
                }),
                ...(product.itemCompanyVendor && {
                  company: product.itemCompanyVendor as ID,
                }),
                ...(product.sales && {
                  sales: product.sales as ID,
                }),
                customCreationDate: new Date(product?.receiveDate) || null,
                memo: product?.memo
                  ? product?.expiryDate
                    ? getDaysDifference(
                        product?.receiveDate,
                        product?.expiryDate,
                      )
                    : DEFAULT_MEMO_DAYS
                  : null,
                receiveDate: new Date(product?.receiveDate) || null,
                tenant: tenantFilter.tenant,
                inputInvoiceNum: product?.vendorInvoice || null,
              },
            },
          );

          await strapi.entityService.create(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              data: {
                eventType: 'receive',
                change: (product?.quantity
                  ? Number(product?.quantity)
                  : 0
                ).toString(),
                remainingQuantity: product?.quantity
                  ? Number(product?.quantity)
                  : 0,
                productInventoryItem: targetInventoryItem?.id,
                ...(product.sales && {
                  addedBy: product.sales as ID,
                }),
                tenant: tenantFilter.tenant,
                itemCost: product.cost ?? 0,
                ...(product.itemContactVendor && {
                  itemContactVendor: product.itemContactVendor as ID,
                }),
                ...(product.itemCompanyVendor && {
                  itemVendor: product.itemCompanyVendor as ID,
                }),
                memo: product?.memo || false,
                expiryDate: memoExpiryDate,
                receiveDate: new Date(product?.receiveDate) || null,
                businessLocation: businessLocationId as ID,
                order: purchaseOrder?.id,
              },
            },
          );

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: targetInventoryItem?.uuid,
                price: product.cost ?? 0,
                quantity: product?.quantity ? Number(product?.quantity) : 0,
                product: targetInventoryItem?.id,
                purchaseType: 'buy',
                order: purchaseOrder?.id,
              },
            },
          );

          const updatedPurchaseOrder = await strapi.entityService.update(
            'api::order.order',
            purchaseOrder?.id,
            {
              data: {
                status: 'received',
                billCreation: false,
              },
            },
          );

          await strapi.entityService.update(
            'api::order.order',
            purchaseOrder?.id,
            {
              data: {
                tax: 0,
                total: updatedPurchaseOrder.subTotal,
                billCreation: true,
                receiveDate: new Date(product?.receiveDate) || null,
                paid: product?.paid || false,
              },
            },
          );

          const currentSellingOrder = await strapi.entityService.findMany(
            'api::order.order',
            {
              filters: {
                orderId: orderId,
                tenant: {
                  id: {
                    $eq: tenantFilter.tenant,
                  },
                },
              },
              fields: ['id'],
            },
          );

          if (!currentSellingOrder?.[0]?.id) return createdProduct;

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: targetInventoryItem?.uuid,
                price: product?.defaultPrice ?? 0,
                quantity: 1,
                product: targetInventoryItem?.id,
                purchaseType: 'buy',
                order: currentSellingOrder?.[0]?.id,
                tax: targetLocationTaxId,
                taxCollection: targetLocationTaxCollectionId,
              },
            },
          );

          return createdProduct;
        }),
      );

      handleLogger(
        'info',
        'createProductsBasedOnAIGeneration',
        'New products in selling order successfully created.',
      );

      return createdProducts.map((item) => item.id);
    }
  } catch (error) {
    return handleError('createProductsBasedOnAIGeneration', undefined, error);
  }
};
