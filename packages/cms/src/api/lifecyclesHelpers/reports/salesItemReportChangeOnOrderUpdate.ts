import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

import { difference, isEmpty } from 'lodash';
import { handleLogger } from '../../../graphql/helpers/errors';
import { discountPopulation } from '../../../graphql/models/discount/helpers/variables';

export const salesItemReportChangeOnOrderUpdate = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeUpdateOrderItemLifeCycleHook salesItemReportChangeOnOrderUpdate',
    `Params :: ${JSON.stringify(event.params)}`,
  );
  const { data, where } = event.params;
  const apiName = event.model.uid;
  const entityId = where?.id;
  const entityQuantity = data?.quantity;
  const entityPrice = data?.price;
  const entityTax = data?.tax;
  const entityTaxCollection = data?.taxCollection;
  const entitySerializes = data?.serializes;

  const discountServices = strapi.service('api::discount.discount');

  if (
    (!(entityQuantity && entityPrice && (entityTax || entityTaxCollection)) ||
      (entityQuantity === currentItemData.quantity &&
        entityPrice === currentItemData.price &&
        (+entityTax === +currentItemData?.tax?.id ||
          +entityTaxCollection === +currentItemData?.taxCollection?.id))) &&
    currentItemData?.order?.type !== 'purchase' &&
    currentItemData?.order?.type !== 'estimate'
  )
    return;

  let quantityDiff = 0;

  const isEditableOrder =
    currentItemData?.order?.status !== 'draft' &&
    currentItemData?.order?.type !== 'purchase' &&
    currentItemData?.order?.type !== 'estimate';

  if (entityQuantity && entityQuantity !== currentItemData.quantity) {
    if (isEditableOrder) {
      const salesItemReportService = strapi.service(
        'api::sales-item-report.sales-item-report',
      );
      const salesItemReportFilter =
        await salesItemReportService.getSalesItemReportFilter({
          apiName,
          entityId,
        });

      const salesItemReportItems = await strapi.entityService.findMany(
        'api::sales-item-report.sales-item-report',
        {
          filters: {
            ...salesItemReportFilter,
          },
          fields: ['id'],
          sort: 'createdAt:desc',
        },
      );

      if (currentItemData.quantity > entityQuantity) {
        quantityDiff = currentItemData.quantity - entityQuantity;

        if (!isEmpty(entitySerializes)) {
          const productOrderItemSerializes: string[] =
            currentItemData?.serializes?.map((item) => String(item.id));

          const removedSerialNumbers = difference(
            productOrderItemSerializes,
            entitySerializes,
          );

          for (const serialNumber of removedSerialNumbers) {
            const salesItemReportItems = await strapi.entityService.findMany(
              'api::sales-item-report.sales-item-report',
              {
                filters: {
                  serialize: {
                    id: serialNumber as ID,
                  },
                },
                fields: ['id'],
              },
            );

            for (const report of salesItemReportItems) {
              await strapi.entityService.delete(
                'api::sales-item-report.sales-item-report',
                report.id,
              );
            }
          }
        } else {
          salesItemReportItems?.slice(0, quantityDiff)?.map(async (item) => {
            await strapi.entityService.delete(
              'api::sales-item-report.sales-item-report',
              item.id,
            );
          });
        }
      } else {
        quantityDiff = entityQuantity - currentItemData.quantity;

        if (apiName === 'api::product-order-item.product-order-item') {
          if (currentItemData?.isCompositeProductItem) return;

          const productInventoryEventService = strapi.service(
            'api::product-inventory-item-event.product-inventory-item-event',
          );

          const {
            itemCostArray,
            receiveDateArray,
            vendorArray,
            memoTakenArray,
            eventsArray,
          } = await productInventoryEventService.getItemCostArray({
            productItemId: currentItemData?.product?.id,
            transferQuantity: quantityDiff ?? 0,
          });

          const productOrderItemSerializes: string[] =
            currentItemData?.serializes?.map((item) => String(item.id));

          const addedSerialNumbers = difference(
            entitySerializes,
            productOrderItemSerializes,
          );

          if (quantityDiff) {
            const discountAmountPerItem =
              discountServices.getDiscountAmountSumForOrderItem(
                currentItemData.price,
                1,
                currentItemData.discounts,
                currentItemData.order,
              );

            for (let i = 0; i < quantityDiff; i++) {
              const itemCost =
                itemCostArray[i] !== undefined ? Number(itemCostArray[i]) : 0;
              const memoTaken =
                memoTakenArray[i] !== undefined
                  ? Boolean(memoTakenArray[i])
                  : false;
              const eventId =
                eventsArray[i] !== undefined ? eventsArray[i] : null;

              const itemPriceWithoutDiscount =
                currentItemData.price - discountAmountPerItem;
              const calculatedGrossMargin =
                itemPriceWithoutDiscount !== 0
                  ? ((itemPriceWithoutDiscount - itemCost) /
                      itemPriceWithoutDiscount) *
                    100
                  : 0;

              const createdAtDate = new Date(
                currentItemData.order.customCreation ??
                  currentItemData.order.createdAt,
              ).getTime();
              const receiveDate = new Date(
                receiveDateArray[i] !== undefined
                  ? receiveDateArray[i]
                  : currentItemData.order.customCreation ??
                    currentItemData.order.createdAt,
              ).getTime();
              const calculatedAge = Math.round(
                (createdAtDate - receiveDate) / (1000 * 60 * 60 * 24),
              );

              const serialNumber =
                addedSerialNumbers?.length > 0 ? addedSerialNumbers[i] : null;

              await strapi.entityService.create(
                'api::sales-item-report.sales-item-report',
                {
                  data: {
                    order: currentItemData.order.id,
                    contact: currentItemData.order.contact?.id || null,
                    company: currentItemData.order.company?.id || null,
                    sales: currentItemData.order.sales?.id || null,
                    tenant: currentItemData.order.tenant.id,
                    soldDate:
                      currentItemData.order.customCreationDate ??
                      currentItemData.order.createdAt,
                    dueDate: currentItemData.order.dueDate || null,
                    businessLocation:
                      currentItemData.order.businessLocation?.id,
                    price: currentItemData.price,
                    type: 'product',
                    productOrderItem: currentItemData.id,
                    grossMargin: calculatedGrossMargin,
                    age: calculatedAge,
                    sublocation: currentItemData.sublocation?.id || null,
                    serialize: serialNumber as ID,
                    itemCost,
                    companyVendor: vendorArray[i]?.itemVendor?.id || null,
                    contactVendor:
                      vendorArray[i]?.itemContactVendor?.id || null,
                    memoTaken,
                    memoSold: Boolean(currentItemData?.order?.memo) || false,
                    productInventoryItemEvent: eventId || null,
                  },
                },
              );
            }
          }
        } else if (
          apiName ===
          'api::composite-product-order-item.composite-product-order-item'
        ) {
          if (quantityDiff) {
            const productInventoryEventService = strapi.service(
              'api::product-inventory-item-event.product-inventory-item-event',
            );

            // Calculate total item cost for all product order items inside the composite
            let totalItemCost = 0;

            if (currentItemData?.productOrderItems?.length > 0) {
              for (const productOrderItem of currentItemData.productOrderItems) {
                if (productOrderItem.product?.id && productOrderItem.quantity) {
                  const { itemCostArray } =
                    await productInventoryEventService.getItemCostArray({
                      productItemId: productOrderItem.product.id,
                      transferQuantity: productOrderItem.quantity,
                    });

                  // Sum up all item costs for this product order item
                  for (let j = 0; j < productOrderItem.quantity; j++) {
                    const cost =
                      itemCostArray[j] !== undefined
                        ? Number(itemCostArray[j])
                        : 0;
                    totalItemCost += cost;
                  }
                }
              }
            }

            const discountAmountPerItem =
              discountServices.getDiscountAmountSumForOrderItem(
                currentItemData.price,
                1,
                currentItemData.discounts ?? [],
                currentItemData.order,
              );

            const itemPriceWithoutDiscount =
              currentItemData.price - discountAmountPerItem;
            const calculatedGrossMargin =
              itemPriceWithoutDiscount !== 0
                ? ((itemPriceWithoutDiscount - totalItemCost) /
                    itemPriceWithoutDiscount) *
                  100
                : 0;
            const parseGrossMargin = parseFloat(
              calculatedGrossMargin?.toFixed(2),
            );

            for (let i = 0; i < quantityDiff; i++) {
              await strapi.entityService.create(
                'api::sales-item-report.sales-item-report',
                {
                  data: {
                    order: currentItemData.order.id,
                    contact: currentItemData.order.contact?.id || null,
                    company: currentItemData.order.company?.id || null,
                    sales: currentItemData.order.sales?.id || null,
                    tenant: currentItemData.order.tenant.id,
                    soldDate:
                      currentItemData.order.customCreationDate ??
                      currentItemData.order.createdAt,
                    dueDate: currentItemData.order.dueDate || null,
                    businessLocation:
                      currentItemData.order.businessLocation?.id,
                    price: currentItemData.price,
                    type: 'composite_product',
                    compositeProductOrderItem: currentItemData.id,
                    itemCost: totalItemCost,
                    grossMargin: parseGrossMargin,
                  },
                },
              );
            }
          }
        } else {
          if (quantityDiff) {
            for (let i = 0; i < quantityDiff; i++) {
              await strapi.entityService.create(
                'api::sales-item-report.sales-item-report',
                {
                  data: {
                    order: currentItemData.order.id,
                    contact: currentItemData.order.contact?.id || null,
                    company: currentItemData.order.company?.id || null,
                    sales: currentItemData.order.sales?.id || null,
                    tenant: currentItemData.order.tenant.id,
                    soldDate:
                      currentItemData.order.customCreationDate ??
                      currentItemData.order.createdAt,
                    dueDate: currentItemData.order.dueDate || null,
                    businessLocation:
                      currentItemData.order.businessLocation?.id,
                    price: currentItemData.price,
                    ...(apiName ===
                      'api::service-order-item.service-order-item' && {
                      type: 'service',
                      serviceOrderItem: currentItemData.id,
                      grossMargin: 100,
                    }),
                    ...(apiName ===
                      'api::membership-order-item.membership-order-item' && {
                      type: 'membership',
                      membershipOrderItem: currentItemData.id,
                    }),
                    ...(apiName ===
                      'api::class-order-item.class-order-item' && {
                      type: 'class',
                      classOrderItem: currentItemData.id,
                    }),
                  },
                },
              );
            }
          }
        }
      }
    }
  }

  if (entityPrice && entityPrice !== currentItemData.price) {
    if (isEditableOrder) {
      const salesItemReportService = strapi.service(
        'api::sales-item-report.sales-item-report',
      );
      const salesItemReportFilter =
        await salesItemReportService.getSalesItemReportFilter({
          apiName,
          entityId,
        });

      const salesItemReportItems = await strapi.entityService.findMany(
        'api::sales-item-report.sales-item-report',
        {
          filters: {
            ...salesItemReportFilter,
          },
          fields: ['id', 'price', 'grossMargin'],
          populate: {
            productOrderItem: {
              fields: ['price', 'quantity'],
              populate: {
                order: {
                  fields: ['subTotal'],
                },
                discounts: discountPopulation as any,
              },
            },
            compositeProductOrderItem: {
              fields: ['price', 'quantity'],
              populate: {
                order: {
                  fields: ['subTotal'],
                },
                discounts: discountPopulation as any,
              },
            },
            serviceOrderItem: {
              fields: ['price', 'quantity'],
              populate: {
                order: {
                  fields: ['subTotal'],
                },
                discounts: discountPopulation as any,
              },
            },
            membershipOrderItem: {
              fields: ['price', 'quantity'],
              populate: {
                order: {
                  fields: ['subTotal'],
                },
                discounts: discountPopulation as any,
              },
            },
            classOrderItem: {
              fields: ['price', 'quantity'],
              populate: {
                order: {
                  fields: ['subTotal'],
                },
                discounts: discountPopulation as any,
              },
            },
          },
          sort: 'createdAt:desc',
        },
      );

      salesItemReportItems?.map(async (item) => {
        const orderItem =
          item?.productOrderItem ||
          item?.compositeProductOrderItem ||
          item?.serviceOrderItem ||
          item?.membershipOrderItem ||
          item?.classOrderItem;

        if (!orderItem) return;

        const discounts = orderItem?.discounts ?? [];
        const order = orderItem?.order;

        const discountAmountPerItem =
          discountServices.getDiscountAmountSumForOrderItem(
            entityPrice,
            1,
            discounts,
            order,
          );

        const itemPriceWithoutDiscount = entityPrice - discountAmountPerItem;

        const itemCost =
          discountAmountPerItem -
          item.price -
          (item.grossMargin / 100) * (item.price - discountAmountPerItem);
        const newCalculatedGrossMargin =
          itemPriceWithoutDiscount !== 0
            ? ((itemPriceWithoutDiscount - itemCost) /
                itemPriceWithoutDiscount) *
              100
            : 0;

        await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          item.id,
          {
            data: {
              price: entityPrice,
              grossMargin: newCalculatedGrossMargin,
            },
          },
        );
      });
    }
  }
};
