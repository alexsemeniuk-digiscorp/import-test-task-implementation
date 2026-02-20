import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { handleLogger } from '../../../graphql/helpers/errors';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const createSalesItemReportInExistingOrder = async (
  { params, result }: AfterLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'ProductOrderItem afterCreateOrderItemLifeCycleHook createSalesItemReportInExistingOrder',
    `Params :: ${JSON.stringify(params)}`,
  );

  const entityId = result.id;
  const data = params?.data;

  const discountServices = strapi.service('api::discount.discount');

  let isImportedItem = false;

  if (params?.data?._isImportedItem) {
    isImportedItem = params?.data?._isImportedItem;
    delete params?.data?._isImportedItem;
  }

  if (
    currentOrder.status !== 'draft' &&
    currentOrder.type !== 'purchase' &&
    currentOrder.type !== 'estimate'
  ) {
    const salesItemReportService = strapi.service(
      'api::sales-item-report.sales-item-report',
    );
    const type = await salesItemReportService.getSalesItemType({ data });

    if (!type) return;

    if (currentOrder.orderVersion === 'historical') {
      const quantityDiff = data.quantity;
      if (type == 'product') {
        if (data?.isCompositeProductItem) return;

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
          productItemId: data?.product,
          transferQuantity: quantityDiff ?? 0,
          isImportedItem,
        });

        const addedSerialNumbers = data?.serializes?.map((item) =>
          String(item.id),
        );

        if (quantityDiff) {
          const discountAmountPerItem =
            discountServices.getDiscountAmountSumForOrderItem(
              data.price,
              1,
              data.discounts,
              currentOrder,
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

            const itemPriceWithoutDiscount = data.price - discountAmountPerItem;
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
              addedSerialNumbers?.length > 0 ? addedSerialNumbers[i] : null;
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
                    currentOrder?.customCreationDate ?? currentOrder.createdAt,
                  dueDate:
                    currentOrder?.dueDate ??
                    currentOrder?.customCreationDate ??
                    null,
                  businessLocation: currentOrder.businessLocation?.id,
                  price: data.price,
                  type: 'product',
                  productOrderItem: entityId,
                  grossMargin: parseGrossMargin,
                  age: calculatedAge,
                  serialize: serialNumber as ID,
                  itemCost,
                  companyVendor: vendorArray[i]?.itemVendor?.id || null,
                  contactVendor: vendorArray[i]?.itemContactVendor?.id || null,
                  memoTaken,
                  memoSold: Boolean(currentOrder?.memo) || false,
                  productInventoryItemEvent: eventId || null,
                },
              },
            );
          }
        }
      } else if (type === 'composite_product') {
        if (quantityDiff) {
          const productInventoryEventService = strapi.service(
            'api::product-inventory-item-event.product-inventory-item-event',
          );

          const compositeProductItem = currentOrder?.compositeProducts?.find(
            (item) => item?.id === entityId,
          );

          // Calculate total item cost for all product order items inside the composite
          let totalItemCost = 0;

          if (compositeProductItem?.productOrderItems?.length > 0) {
            for (const productOrderItem of compositeProductItem.productOrderItems) {
              if (productOrderItem.product?.id && productOrderItem.quantity) {
                const { itemCostArray } =
                  await productInventoryEventService.getItemCostArray({
                    productItemId: productOrderItem.product.id,
                    transferQuantity: productOrderItem.quantity,
                    isImportedItem,
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
              data.price,
              1,
              compositeProductItem?.discounts ?? [],
              currentOrder,
            );

          const itemPriceWithoutDiscount = data.price - discountAmountPerItem;
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
                  order: currentOrder.id,
                  contact: currentOrder.contact?.id || null,
                  company: currentOrder.company?.id || null,
                  sales: currentOrder.sales?.id || null,
                  tenant: currentOrder.tenant.id,
                  soldDate:
                    currentOrder?.customCreationDate ?? currentOrder.createdAt,
                  dueDate:
                    currentOrder?.dueDate ??
                    currentOrder?.customCreationDate ??
                    null,
                  businessLocation: currentOrder.businessLocation?.id,
                  price: data.price,
                  type,
                  compositeProductOrderItem: entityId,
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
                  order: currentOrder.id,
                  contact: currentOrder.contact?.id || null,
                  company: currentOrder.company?.id || null,
                  sales: currentOrder.sales?.id || null,
                  tenant: currentOrder.tenant.id,
                  soldDate:
                    currentOrder?.customCreationDate ?? currentOrder.createdAt,
                  dueDate:
                    currentOrder?.dueDate ??
                    currentOrder?.customCreationDate ??
                    null,
                  businessLocation: currentOrder.businessLocation?.id,
                  price: data.price,
                  type,
                  ...(type === 'service' && {
                    type,
                    serviceOrderItem: entityId,
                    grossMargin: 100,
                  }),
                  ...(type === 'membership' && {
                    type,
                    membershipOrderItem: entityId,
                  }),
                  ...(type === 'class' && {
                    type,
                    classOrderItem: entityId,
                  }),
                },
              },
            );
          }
        }
      }
    }
    if (currentOrder.orderVersion === 'historical') return;
    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    if (type === 'product' && result?.quantity) {
      if (result?.isCompositeProductItem) return;
      const discountAmountPerItem =
        discountServices.getDiscountAmountSumForOrderItem(
          result.price,
          1,
          result.discounts ?? currentOrder?.discounts,
          currentOrder,
        );

      const {
        itemCostArray,
        receiveDateArray,
        vendorArray,
        memoTakenArray,
        eventsArray,
      } = await productInventoryEventService.getItemCostArray({
        productItemId: currentOrder?.products?.find(
          (product) => product?.id === result?.id,
        )?.product?.id,
        transferQuantity: result?.quantity ?? 0,
        isImportedItem,
      });

      for (let i = 0; i < result.quantity; i++) {
        const itemCost =
          itemCostArray[i] !== undefined ? Number(itemCostArray[i]) : 0;
        const memoTaken =
          memoTakenArray[i] !== undefined ? Boolean(memoTakenArray[i]) : false;
        const eventId = eventsArray[i] !== undefined ? eventsArray[i] : null;

        const itemPriceWithoutDiscount = result.price - discountAmountPerItem;
        const calculatedGrossMargin =
          itemPriceWithoutDiscount !== 0
            ? ((itemPriceWithoutDiscount - itemCost) /
                itemPriceWithoutDiscount) *
              100
            : 0;
        const createdAtDate = new Date(currentOrder.createdAt).getTime();
        const receiveDate = new Date(
          receiveDateArray[i] !== undefined
            ? receiveDateArray[i]
            : currentOrder.createdAt,
        ).getTime();
        const calculatedAge = Math.round(
          (createdAtDate - receiveDate) / (1000 * 60 * 60 * 24),
        );

        const parseGrossMargin = parseFloat(calculatedGrossMargin?.toFixed(2));

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
                currentOrder?.customCreationDate ?? currentOrder.createdAt,
              dueDate:
                currentOrder?.dueDate ??
                currentOrder?.customCreationDate ??
                null,
              businessLocation: currentOrder.businessLocation?.id,
              price: result.price,
              type,
              productOrderItem: result.id,
              grossMargin: parseGrossMargin,
              age: calculatedAge,
              sublocation: data?.sublocation?.id || null,
              itemCost,
              companyVendor: vendorArray[i]?.itemVendor?.id || null,
              contactVendor: vendorArray[i]?.itemContactVendor?.id || null,
              memoTaken,
              memoSold: Boolean(currentOrder?.memo) || false,
              productInventoryItemEvent: eventId || null,
            },
          },
        );
      }
    } else if (type === 'composite_product' && result?.quantity) {
      const compositeProductItem = currentOrder?.compositeProducts?.find(
        (item) => item?.id === result?.id,
      );

      // Calculate total item cost for all product order items inside the composite
      let totalItemCost = 0;

      if (compositeProductItem?.productOrderItems?.length > 0) {
        for (const productOrderItem of compositeProductItem.productOrderItems) {
          if (productOrderItem.product?.id && productOrderItem.quantity) {
            const { itemCostArray } =
              await productInventoryEventService.getItemCostArray({
                productItemId: productOrderItem.product.id,
                transferQuantity: productOrderItem.quantity,
              });

            // Sum up all item costs for this product order item
            for (let j = 0; j < productOrderItem.quantity; j++) {
              const cost =
                itemCostArray[j] !== undefined ? Number(itemCostArray[j]) : 0;
              totalItemCost += cost;
            }
          }
        }
      }

      const discountAmountPerItem =
        discountServices.getDiscountAmountSumForOrderItem(
          result.price,
          1,
          compositeProductItem?.discounts ?? [],
          currentOrder,
        );

      const itemPriceWithoutDiscount = result.price - discountAmountPerItem;
      const calculatedGrossMargin =
        itemPriceWithoutDiscount !== 0
          ? ((itemPriceWithoutDiscount - totalItemCost) /
              itemPriceWithoutDiscount) *
            100
          : 0;
      const parseGrossMargin = parseFloat(calculatedGrossMargin?.toFixed(2));

      for (let i = 0; i < result.quantity; i++) {
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
                currentOrder?.customCreationDate ?? currentOrder.createdAt,
              dueDate:
                currentOrder?.dueDate ??
                currentOrder?.customCreationDate ??
                null,
              businessLocation: currentOrder.businessLocation?.id,
              price: result.price,
              type,
              compositeProductOrderItem: result.id,
              itemCost: totalItemCost,
              grossMargin: parseGrossMargin,
            },
          },
        );
      }
    } else if (result?.quantity) {
      for (let i = 0; i < result.quantity; i++) {
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
                currentOrder?.customCreationDate ?? currentOrder.createdAt,
              dueDate:
                currentOrder?.dueDate ??
                currentOrder?.customCreationDate ??
                null,
              businessLocation: currentOrder.businessLocation?.id,
              price: result.price,
              type,
              ...(type === 'service' && {
                serviceOrderItem: result.id,
                grossMargin: 100,
              }),
              ...(type === 'membership' && {
                membershipOrderItem: result.id,
              }),
              ...(type === 'class' && {
                classOrderItem: result.id,
              }),
            },
          },
        );
      }
    }
  }
};
