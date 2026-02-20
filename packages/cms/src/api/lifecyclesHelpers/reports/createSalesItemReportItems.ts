import { SalesItemReportType } from '../types';
import { handleError } from './../../../graphql/helpers/errors';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createSalesItemReportItems = async (
  { params }: AfterLifecycleEvent,
  currentOrder,
) => {
  try {
    const discountServices = strapi.service('api::discount.discount');

    if (
      currentOrder.status === 'draft' &&
      params.data.status &&
      params.data.status !== 'draft' &&
      params.data.type !== 'purchase' &&
      params.data.type !== 'estimate'
    ) {
      const createReportsForItems = async (
        items: any,
        type: SalesItemReportType,
      ) => {
        for (const item of items) {
          const productInventoryEventService = strapi.service(
            'api::product-inventory-item-event.product-inventory-item-event',
          );

          if (type === 'product') {
            if (item?.isCompositeProductItem) return;
            const {
              itemCostArray,
              receiveDateArray,
              vendorArray,
              memoTakenArray,
              eventsArray,
            } = await productInventoryEventService.getItemCostArray({
              productItemId: item.product.id,
              transferQuantity: item.quantity ?? 0,
            });

            if (item?.quantity) {
              const discountAmountPerItem =
                discountServices.getDiscountAmountSumForOrderItem(
                  item.price,
                  1,
                  item.discounts,
                  currentOrder,
                );

              for (let i = 0; i < item.quantity; i++) {
                const itemCost =
                  itemCostArray[i] !== undefined ? Number(itemCostArray[i]) : 0;
                const memoTaken =
                  memoTakenArray[i] !== undefined
                    ? Boolean(memoTakenArray[i])
                    : false;
                const eventId =
                  eventsArray[i] !== undefined ? eventsArray[i] : null;

                const itemPriceWithoutDiscount =
                  item.price - discountAmountPerItem;
                const calculatedGrossMargin =
                  itemPriceWithoutDiscount !== 0
                    ? ((itemPriceWithoutDiscount - itemCost) /
                        itemPriceWithoutDiscount) *
                      100
                    : 0;
                const createdAtDate = new Date(
                  currentOrder.customCreationDate ?? currentOrder.createdAt,
                ).getTime();
                const receiveDate = new Date(
                  receiveDateArray[i] !== undefined
                    ? receiveDateArray[i]
                    : createdAtDate,
                ).getTime();
                const calculatedAge = Math.round(
                  (createdAtDate - receiveDate) / (1000 * 60 * 60 * 24),
                );

                const serialNumber =
                  item?.serializes?.length > 0 ? item?.serializes[i]?.id : null;
                const parseGrossMargin = parseFloat(
                  calculatedGrossMargin?.toFixed(2),
                );
                await strapi.entityService.create(
                  'api::sales-item-report.sales-item-report',
                  {
                    data: {
                      order: currentOrder.id,
                      contact: currentOrder.contact?.id || null,
                      company: currentOrder.company?.id || null,
                      sales: currentOrder.sales?.id || null,
                      tenant: currentOrder.tenant.id,
                      soldDate:
                        currentOrder?.customCreationDate ??
                        currentOrder.createdAt,
                      dueDate:
                        currentOrder?.dueDate ??
                        currentOrder?.customCreationDate ??
                        null,
                      businessLocation: currentOrder.businessLocation?.id,
                      price: item.price,
                      type,
                      productOrderItem: item.id,
                      grossMargin: parseGrossMargin,
                      age: calculatedAge,
                      sublocation: item.sublocation?.id || null,
                      serialize: serialNumber,
                      itemCost,
                      companyVendor: vendorArray[i]?.itemVendor?.id || null,
                      contactVendor:
                        vendorArray[i]?.itemContactVendor?.id || null,
                      memoTaken,
                      memoSold: Boolean(currentOrder?.memo) || false,
                      productInventoryItemEvent: eventId || null,
                    },
                  },
                );
              }
            }
          } else if (type === 'composite_product') {
            if (item?.quantity) {
              // Calculate total item cost for all product order items inside the composite
              let totalItemCost = 0;

              if (item.productOrderItems?.length > 0) {
                for (const productOrderItem of item.productOrderItems) {
                  if (
                    productOrderItem.product?.id &&
                    productOrderItem.quantity
                  ) {
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
                  item.price,
                  1,
                  item.discounts ?? [],
                  currentOrder,
                );

              const itemPriceWithoutDiscount =
                item.price - discountAmountPerItem;
              const calculatedGrossMargin =
                itemPriceWithoutDiscount !== 0
                  ? ((itemPriceWithoutDiscount - totalItemCost) /
                      itemPriceWithoutDiscount) *
                    100
                  : 0;
              const parseGrossMargin = parseFloat(
                calculatedGrossMargin?.toFixed(2),
              );

              for (let i = 0; i < item.quantity; i++) {
                await strapi.entityService.create(
                  'api::sales-item-report.sales-item-report',
                  {
                    data: {
                      order: currentOrder.id,
                      contact: currentOrder.contact?.id || null,
                      company: currentOrder.company?.id || null,
                      sales: currentOrder.sales?.id || null,
                      tenant: currentOrder.tenant.id,
                      soldDate:
                        currentOrder?.customCreationDate ??
                        currentOrder.createdAt,
                      dueDate:
                        currentOrder?.dueDate ??
                        currentOrder?.customCreationDate ??
                        null,
                      businessLocation: currentOrder.businessLocation?.id,
                      price: item.price,
                      type,
                      compositeProductOrderItem: item.id,
                      itemCost: totalItemCost,
                      grossMargin: parseGrossMargin,
                    },
                  },
                );
              }
            }
          } else {
            if (item?.quantity) {
              for (let i = 0; i < item.quantity; i++) {
                await strapi.entityService.create(
                  'api::sales-item-report.sales-item-report',
                  {
                    data: {
                      order: currentOrder.id,
                      contact: currentOrder.contact?.id || null,
                      company: currentOrder.company?.id || null,
                      sales: currentOrder.sales?.id || null,
                      tenant: currentOrder.tenant.id,
                      soldDate:
                        currentOrder?.customCreationDate ??
                        currentOrder.createdAt,
                      dueDate:
                        currentOrder?.dueDate ??
                        currentOrder?.customCreationDate ??
                        null,
                      businessLocation: currentOrder.businessLocation?.id,
                      price: item.price,
                      type,
                      ...(type === 'service' && {
                        serviceOrderItem: item.id,
                        grossMargin: 100,
                      }),
                      ...(type === 'membership' && {
                        membershipOrderItem: item.id,
                      }),
                      ...(type === 'class' && {
                        classOrderItem: item.id,
                      }),
                    },
                  },
                );
              }
            }
          }
        }
      };

      await Promise.all([
        createReportsForItems(currentOrder.products, 'product'),
        createReportsForItems(
          currentOrder.compositeProducts,
          'composite_product',
        ),
        createReportsForItems(currentOrder.services, 'service'),
        createReportsForItems(currentOrder.memberships, 'membership'),
        createReportsForItems(currentOrder.classes, 'class'),
      ]);
    }
  } catch (e) {
    handleError(e, undefined, 'createSalesItemReportItems');
  }
};
