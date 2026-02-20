import { GraphQLFieldResolver } from 'graphql';
import { generateId } from '../../../../utils/randomBytes';
import { handleError } from '../../../helpers/errors';
import { addDaysToDateAsDate } from '../../../helpers/getDaysDifference';
import { SplitOrderInput } from '../order.types';

export const splitOrder: GraphQLFieldResolver<
  null,
  null,
  { input: SplitOrderInput }
> = async (root, { input }, ctx, info) => {
  try {
    const {
      orderId,
      productItems,
      serviceItems,
      compositeProductItems,
      membershipItems,
      classItems,
      memo,
    } = input;

    const orders = await strapi.entityService.findMany('api::order.order', {
      filters: { orderId: { $eq: orderId } },
      fields: [
        'id',
        'status',
        'type',
        'inputInvoiceNum',
        'memo',
        'memoNumber',
        'dueDate',
        'note',
        'isWarranty',
      ],
      populate: {
        products: {
          fields: [
            'id',
            'itemId',
            'quantity',
            'price',
            'purchaseType',
            'note',
            'isShowInvoiceNote',
            'isVisibleInDocs',
            'isCompositeProductItem',
          ],
          populate: {
            product: { fields: ['id'] },
            tax: { fields: ['id'] },
            taxCollection: { fields: ['id'] },
            discounts: { fields: ['id'] },
          },
        },
        services: {
          fields: [
            'id',
            'itemId',
            'quantity',
            'price',
            'note',
            'dueDate',
            'isShowInvoiceNote',
            'isVisibleInDocs',
          ],
          populate: {
            service: { fields: ['id'] },
            tax: { fields: ['id'] },
            taxCollection: { fields: ['id'] },
            discounts: { fields: ['id'] },
          },
        },
        compositeProducts: {
          fields: [
            'id',
            'itemId',
            'quantity',
            'price',
            'purchaseType',
            'note',
            'isShowInvoiceNote',
            'isVisibleInDocs',
          ],
          populate: {
            compositeProduct: { fields: ['id'] },
            tax: { fields: ['id'] },
            taxCollection: { fields: ['id'] },
            discounts: { fields: ['id'] },
            productOrderItems: {
              fields: [
                'id',
                'itemId',
                'quantity',
                'price',
                'purchaseType',
                'note',
                'isShowInvoiceNote',
                'isVisibleInDocs',
                'isCompositeProductItem',
              ],
              populate: {
                product: { fields: ['id'] },
                tax: { fields: ['id'] },
                taxCollection: { fields: ['id'] },
                discounts: { fields: ['id'] },
              },
            },
          },
        },
        memberships: {
          fields: [
            'id',
            'itemId',
            'quantity',
            'price',
            'purchaseType',
            'note',
            'isShowInvoiceNote',
            'isVisibleInDocs',
          ],
          populate: {
            membership: { fields: ['id'] },
            tax: { fields: ['id'] },
            taxCollection: { fields: ['id'] },
            discounts: { fields: ['id'] },
          },
        },
        classes: {
          fields: [
            'id',
            'itemId',
            'quantity',
            'price',
            'purchaseType',
            'note',
            'isShowInvoiceNote',
            'isVisibleInDocs',
          ],
          populate: {
            class: { fields: ['id'] },
            tax: { fields: ['id'] },
            taxCollection: { fields: ['id'] },
            discounts: { fields: ['id'] },
          },
        },
        discounts: { fields: ['id'] },
        sales: { fields: ['id'] },
        contact: { fields: ['id'] },
        company: { fields: ['id'] },
        businessLocation: { fields: ['id'] },
        tenant: { fields: ['id'] },
      },
    });

    const order = orders?.[0];

    if (!order) {
      throw new Error('Order not found');
    }

    // Validate that there are items to split
    const hasProductsToSplit = productItems?.some((item) => item?.quantity > 0);
    const hasServicesToSplit = serviceItems?.some((item) => item?.quantity > 0);
    const hasCompositeProductsToSplit = compositeProductItems?.some(
      (item) => item?.quantity > 0,
    );
    const hasMembershipsToSplit = membershipItems?.some(
      (item) => item?.quantity > 0,
    );
    const hasClassesToSplit = classItems?.some((item) => item?.quantity > 0);

    if (
      !hasProductsToSplit &&
      !hasServicesToSplit &&
      !hasCompositeProductsToSplit &&
      !hasMembershipsToSplit &&
      !hasClassesToSplit
    ) {
      throw new Error('Please select at least one item to split');
    }

    const orderDiscountIds =
      order?.discounts?.map((discount) => discount?.id) ?? [];

    const newOrderId = generateId();
    const newOrder = await strapi.entityService.create('api::order.order', {
      data: {
        orderId: newOrderId,
        status: order.status ?? 'placed',
        businessLocation: order.businessLocation?.id,
        total: 0,
        subTotal: 0,
        discount: 0,
        tax: 0,
        type: order?.type ?? 'purchase',
        sales: order?.sales?.id,
        contact: order?.contact?.id,
        company: order?.company?.id,
        inputInvoiceNum: order?.inputInvoiceNum,
        memo: memo || undefined,
        memoNumber: order?.memoNumber,
        dueDate: order?.dueDate,
        note: order?.note,
        isWarranty: order?.isWarranty,
        tenant: order?.tenant?.id,
        discounts: orderDiscountIds,
        ...(order.type === 'purchase' &&
          order.status === 'received' && { receiveDate: new Date() }),
        ...(order.type === 'sell' &&
          order.status === 'shipped' && { shippedDate: new Date() }),
      },
    });

    if (productItems?.length) {
      for (const splitItem of productItems) {
        if (splitItem?.quantity <= 0) continue;

        const initialProduct = order?.products?.find(
          (product) => String(product?.id) === String(splitItem?.id),
        );

        if (!initialProduct) {
          throw new Error(
            `Product order item with id ${splitItem.id} not found`,
          );
        }

        if (initialProduct?.isCompositeProductItem) continue;

        const initialQuantity = initialProduct?.quantity ?? 0;
        if (splitItem?.quantity > initialQuantity) {
          throw new Error(
            `Split quantity (${splitItem?.quantity}) exceeds available quantity (${initialQuantity})`,
          );
        }

        const productDiscountIds =
          initialProduct?.discounts?.map((d) => d?.id) ?? [];

        const remainingQty = initialQuantity - splitItem?.quantity;
        await strapi.entityService.update(
          'api::product-order-item.product-order-item',
          initialProduct.id,
          {
            data: {
              quantity: remainingQty,
              price: initialProduct?.price,
              tax: initialProduct?.tax?.id,
              taxCollection: initialProduct?.taxCollection?.id,
            },
          },
        );

        await strapi.entityService.create(
          'api::product-order-item.product-order-item',
          {
            data: {
              itemId: initialProduct?.itemId,
              order: newOrder?.id,
              product: initialProduct?.product?.id,
              quantity: splitItem?.quantity,
              price: initialProduct?.price,
              purchaseType: initialProduct?.purchaseType,
              tax: initialProduct?.tax?.id,
              taxCollection: initialProduct?.taxCollection?.id,
              note: initialProduct?.note,
              isShowInvoiceNote: initialProduct?.isShowInvoiceNote,
              isVisibleInDocs: initialProduct?.isVisibleInDocs,
              tenant: order?.tenant?.id,
              discounts: productDiscountIds,
            },
          },
        );

        if (order.status === 'received') {
          const receiveEvents = await strapi.entityService.findMany(
            'api::product-inventory-item-event.product-inventory-item-event',
            {
              filters: {
                productInventoryItem: {
                  id: { $eq: initialProduct?.product?.id },
                },
                order: {
                  id: { $eq: order.id },
                },
                eventType: 'receive',
              },
            },
          );

          if (receiveEvents?.length > 0) {
            const receiveEvent = receiveEvents[0];
            const oldChange = parseInt(receiveEvent.change);
            const oldRemainingQuantity = receiveEvent.remainingQuantity;
            const splitQuantity = splitItem?.quantity;

            const usedInOriginal = oldChange - oldRemainingQuantity;

            let remainingInNew: number;

            if (splitQuantity >= usedInOriginal) {
              remainingInNew = splitQuantity - usedInOriginal;
            } else {
              remainingInNew = 0;
            }

            const newOldChange = oldChange - splitQuantity;
            const newOldRemainingQuantity =
              oldRemainingQuantity - remainingInNew;

            const newEventChange = splitQuantity;
            const newEventRemainingQuantity = remainingInNew;

            await strapi.entityService.update(
              'api::product-inventory-item-event.product-inventory-item-event',
              receiveEvent.id,
              {
                data: {
                  change: `+${newOldChange}`,
                  remainingQuantity: newOldRemainingQuantity,
                },
              },
            );

            const receiveDate = new Date();
            let expiryDate = null;

            if (memo) {
              expiryDate = addDaysToDateAsDate(receiveDate, memo);
            }

            await strapi.entityService.create(
              'api::product-inventory-item-event.product-inventory-item-event',
              {
                data: {
                  order: newOrder.id,
                  eventType: 'receive',
                  change: newEventChange.toString(),
                  remainingQuantity: newEventRemainingQuantity,
                  productInventoryItem: initialProduct?.product?.id,
                  addedBy: order?.sales?.id,
                  businessLocation: order?.businessLocation?.id,
                  tenant: order?.tenant?.id,
                  itemCost: initialProduct?.price,
                  itemVendor: order?.company?.id ?? null,
                  itemContactVendor: order?.contact?.id ?? null,
                  memo: !!memo,
                  expiryDate,
                  receiveDate,
                },
              },
            );
          }
        }
      }
    }

    if (serviceItems?.length) {
      for (const splitItem of serviceItems) {
        if (splitItem?.quantity <= 0) continue;

        const initialService = order?.services?.find(
          (service) => String(service?.id) === String(splitItem?.id),
        );

        if (!initialService) {
          throw new Error(
            `Service order item with id ${splitItem?.id} not found`,
          );
        }

        const initialQuantity = initialService?.quantity ?? 0;
        if (splitItem?.quantity > initialQuantity) {
          throw new Error(
            `Split quantity (${splitItem?.quantity}) exceeds available quantity (${initialQuantity})`,
          );
        }

        const serviceDiscountIds =
          initialService?.discounts?.map((d) => d?.id) ?? [];

        const remainingQty = initialQuantity - splitItem?.quantity;
        await strapi.entityService.update(
          'api::service-order-item.service-order-item',
          initialService?.id,
          {
            data: {
              quantity: remainingQty,
              price: initialService?.price,
              tax: initialService?.tax?.id,
              taxCollection: initialService?.taxCollection?.id,
            },
          },
        );

        await strapi.entityService.create(
          'api::service-order-item.service-order-item',
          {
            data: {
              itemId: initialService?.itemId,
              order: newOrder?.id,
              service: initialService?.service?.id,
              quantity: splitItem?.quantity,
              price: initialService?.price,
              tax: initialService?.tax?.id,
              taxCollection: initialService?.taxCollection?.id,
              note: initialService?.note,
              dueDate: initialService?.dueDate,
              isShowInvoiceNote: initialService?.isShowInvoiceNote,
              isVisibleInDocs: initialService?.isVisibleInDocs,
              tenant: order?.tenant?.id,
              discounts: serviceDiscountIds,
            },
          },
        );
      }
    }

    if (compositeProductItems?.length) {
      for (const splitItem of compositeProductItems) {
        if (splitItem?.quantity <= 0) continue;

        const initialCompositeProduct = order?.compositeProducts?.find(
          (item) => String(item?.id) === String(splitItem?.id),
        );

        if (!initialCompositeProduct) {
          throw new Error(
            `Composite product order item with id ${splitItem?.id} not found`,
          );
        }

        const initialQuantity = initialCompositeProduct?.quantity ?? 0;
        if (splitItem?.quantity > initialQuantity) {
          throw new Error(
            `Split quantity (${splitItem?.quantity}) exceeds available quantity (${initialQuantity})`,
          );
        }

        const compositeProductDiscountIds =
          initialCompositeProduct?.discounts?.map((d) => d?.id) ?? [];

        const remainingQty = initialQuantity - splitItem?.quantity;
        await strapi.entityService.update(
          'api::composite-product-order-item.composite-product-order-item',
          initialCompositeProduct?.id,
          {
            data: {
              quantity: remainingQty,
              price: initialCompositeProduct?.price,
              tax: initialCompositeProduct?.tax?.id,
              taxCollection: initialCompositeProduct?.taxCollection?.id,
            },
          },
        );

        const newCompositeProductOrderItem = await strapi.entityService.create(
          'api::composite-product-order-item.composite-product-order-item',
          {
            data: {
              itemId: initialCompositeProduct?.itemId,
              order: newOrder?.id,
              compositeProduct: initialCompositeProduct?.compositeProduct?.id,
              quantity: splitItem?.quantity,
              price: initialCompositeProduct?.price,
              purchaseType: initialCompositeProduct?.purchaseType,
              tax: initialCompositeProduct?.tax?.id,
              taxCollection: initialCompositeProduct?.taxCollection?.id,
              note: initialCompositeProduct?.note,
              isShowInvoiceNote: initialCompositeProduct?.isShowInvoiceNote,
              isVisibleInDocs: initialCompositeProduct?.isVisibleInDocs,
              tenant: order?.tenant?.id,
              discounts: compositeProductDiscountIds,
              _skipCreateProductOrderItems: true,
            },
          },
        );

        const relatedProductOrderItems =
          initialCompositeProduct?.productOrderItems ?? [];

        for (const productOrderItem of relatedProductOrderItems) {
          if (!productOrderItem?.isCompositeProductItem) continue;

          const productOrderItemQuantity = productOrderItem?.quantity ?? 0;
          const quantityPerComposite =
            productOrderItemQuantity / initialQuantity;
          const splitProductQuantity = Math.round(
            quantityPerComposite * splitItem?.quantity,
          );

          if (splitProductQuantity <= 0) continue;

          const productDiscountIds =
            productOrderItem?.discounts?.map((d) => d?.id) ?? [];

          const remainingProductQty =
            productOrderItemQuantity - splitProductQuantity;
          await strapi.entityService.update(
            'api::product-order-item.product-order-item',
            productOrderItem?.id,
            {
              data: {
                quantity: remainingProductQty,
                price: productOrderItem?.price,
                tax: productOrderItem?.tax?.id,
                taxCollection: productOrderItem?.taxCollection?.id,
              },
            },
          );

          await strapi.entityService.create(
            'api::product-order-item.product-order-item',
            {
              data: {
                itemId: productOrderItem?.itemId,
                order: newOrder?.id,
                product: productOrderItem?.product?.id,
                quantity: splitProductQuantity,
                price: productOrderItem?.price,
                purchaseType: productOrderItem?.purchaseType,
                tax: productOrderItem?.tax?.id,
                taxCollection: productOrderItem?.taxCollection?.id,
                note: productOrderItem?.note,
                isShowInvoiceNote: productOrderItem?.isShowInvoiceNote,
                isVisibleInDocs: productOrderItem?.isVisibleInDocs,
                isCompositeProductItem: true,
                compositeProductOrderItem: newCompositeProductOrderItem?.id,
                tenant: order?.tenant?.id,
                discounts: productDiscountIds,
              },
            },
          );
        }
      }
    }

    if (membershipItems?.length) {
      for (const splitItem of membershipItems) {
        if (splitItem?.quantity <= 0) continue;

        const initialMembership = order?.memberships?.find(
          (item) => String(item?.id) === String(splitItem?.id),
        );

        if (!initialMembership) {
          throw new Error(
            `Membership order item with id ${splitItem?.id} not found`,
          );
        }

        const initialQuantity = initialMembership?.quantity ?? 0;
        if (splitItem?.quantity > initialQuantity) {
          throw new Error(
            `Split quantity (${splitItem?.quantity}) exceeds available quantity (${initialQuantity})`,
          );
        }

        const membershipDiscountIds =
          initialMembership?.discounts?.map((d) => d?.id) ?? [];

        const remainingQty = initialQuantity - splitItem?.quantity;
        await strapi.entityService.update(
          'api::membership-order-item.membership-order-item',
          initialMembership?.id,
          {
            data: {
              quantity: remainingQty,
              price: initialMembership?.price,
              tax: initialMembership?.tax?.id,
              taxCollection: initialMembership?.taxCollection?.id,
            },
          },
        );

        await strapi.entityService.create(
          'api::membership-order-item.membership-order-item',
          {
            data: {
              itemId: initialMembership?.itemId,
              order: newOrder?.id,
              membership: initialMembership?.membership?.id,
              quantity: splitItem?.quantity,
              price: initialMembership?.price,
              purchaseType: initialMembership?.purchaseType,
              tax: initialMembership?.tax?.id,
              taxCollection: initialMembership?.taxCollection?.id,
              note: initialMembership?.note,
              isShowInvoiceNote: initialMembership?.isShowInvoiceNote,
              isVisibleInDocs: initialMembership?.isVisibleInDocs,
              tenant: order?.tenant?.id,
              discounts: membershipDiscountIds,
            },
          },
        );
      }
    }

    if (classItems?.length) {
      for (const splitItem of classItems) {
        if (splitItem?.quantity <= 0) continue;

        const initialClass = order?.classes?.find(
          (item) => String(item?.id) === String(splitItem?.id),
        );

        if (!initialClass) {
          throw new Error(
            `Class order item with id ${splitItem?.id} not found`,
          );
        }

        const initialQuantity = initialClass?.quantity ?? 0;
        if (splitItem?.quantity > initialQuantity) {
          throw new Error(
            `Split quantity (${splitItem?.quantity}) exceeds available quantity (${initialQuantity})`,
          );
        }

        const classDiscountIds =
          initialClass?.discounts?.map((d) => d?.id) ?? [];

        const remainingQty = initialQuantity - splitItem?.quantity;
        await strapi.entityService.update(
          'api::class-order-item.class-order-item',
          initialClass?.id,
          {
            data: {
              quantity: remainingQty,
              price: initialClass?.price,
              tax: initialClass?.tax?.id,
              taxCollection: initialClass?.taxCollection?.id,
            },
          },
        );

        await strapi.entityService.create(
          'api::class-order-item.class-order-item',
          {
            data: {
              itemId: initialClass?.itemId,
              order: newOrder?.id,
              class: initialClass?.class?.id,
              quantity: splitItem?.quantity,
              price: initialClass?.price,
              purchaseType: initialClass?.purchaseType,
              tax: initialClass?.tax?.id,
              taxCollection: initialClass?.taxCollection?.id,
              note: initialClass?.note,
              isShowInvoiceNote: initialClass?.isShowInvoiceNote,
              isVisibleInDocs: initialClass?.isVisibleInDocs,
              tenant: order?.tenant?.id,
              discounts: classDiscountIds,
            },
          },
        );
      }
    }

    return {
      newOrderId: newOrderId,
    };
  } catch (e) {
    handleError('splitOrder', undefined, e);
  }
};
