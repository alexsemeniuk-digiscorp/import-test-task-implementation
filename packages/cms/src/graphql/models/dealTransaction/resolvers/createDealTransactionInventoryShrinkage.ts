import { GraphQLFieldResolver } from 'graphql';
import { handleError, handleLogger } from '../../../../graphql/helpers/errors';

import { generateId } from '../../../../utils/randomBytes';
import { CreateDealTransactionInventoryShrinkageInput } from '../types/types';

export const createDealTransactionInventoryShrinkage: GraphQLFieldResolver<
  null,
  null,
  { input: CreateDealTransactionInventoryShrinkageInput }
> = async (root, { input }, ctx, info) => {
  handleLogger(
    'info',
    'Resolver :: createDealTransactionInventoryShrinkage',
    `Input: ${JSON.stringify(input)}`,
  );
  const { adjustmentID } = input;
  if (!adjustmentID)
    return handleError(
      'Resolver :: createDealTransactionInventoryShrinkage',
      `Adjustment ID was not found`,
    );

  /* services */
  const adjustmentService = strapi.service(
    'api::inventory-adjustment.inventory-adjustment',
  );
  const adjustmentItemService = strapi.service(
    'api::inventory-adjustment-item.inventory-adjustment-item',
  );
  const chartCategoryService = strapi.service(
    'api::chart-category.chart-category',
  );
  const chartAccountService = strapi.service(
    'api::chart-account.chart-account',
  );
  const dealTransactionService = strapi.service(
    'api::deal-transaction.deal-transaction',
  );
  const productInventoryItemService = strapi.service(
    'api::product-inventory-item.product-inventory-item',
  );
  const productInventoryEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  const adjustment = await adjustmentService.findOne(adjustmentID, {
    populate: ['location', 'tenant', 'sublocation', 'employee'],
  });

  const adjustmentItems = await adjustmentItemService.findMany({
    filters: {
      inventoryAdjustment: { id: { $eq: adjustment.id } },
      adjustedQuantity: { $gt: 0 },
    },
    populate: ['product', 'tenant', 'serializes'],
  });

  if (!adjustmentItems.length)
    return handleError(
      'Resolver :: createDealTransactionInventoryShrinkage',
      'Adjustment Items was not found',
    );

  let chartInventoryShrinkage: any;

  const chartInventoryShrinkages = await chartAccountService.findMany({
    filters: {
      name: { $eq: 'Inventory Shrinkage' },
      type: { $eq: 'cost' },
    },
  });

  if (!chartInventoryShrinkages.length) {
    chartInventoryShrinkage = await chartAccountService.create({
      type: 'cost',
      name: 'Inventory Shrinkage',
    });
  } else {
    chartInventoryShrinkage = chartInventoryShrinkages[0];
  }

  const adjustmentItemPromises = adjustmentItems.map(async (adjsItm) => {
    const productId = adjsItm?.product?.id;
    const adjustedQuantity = adjsItm?.adjustedQuantity;

    if (!adjustedQuantity || adjustedQuantity <= 0) return;

    try {
      const productInventoryItems = await productInventoryItemService.findMany({
        filters: {
          product: { id: { $eq: productId } },
          businessLocation: { id: { $eq: adjustment.location.id } },
        },
        populate: [
          'product_inventory_item_events',
          'product',
          'businessLocation',
        ],
      });

      if (!productInventoryItems.length) {
        handleLogger(
          'warn',
          'Resolver :: createDealTransactionInventoryShrinkage',
          `ProductInventoryItem not found for product ${productId} at businessLocation ${adjustment?.businessLocation?.id}`,
        );
        return { status: 'skipped', reason: 'No ProductInventoryItem found' };
      }

      let receivedEvents = await productInventoryEventService.findManyReceived({
        productInventoryId: productInventoryItems[0]?.id,
        businessLocationId: adjustment?.location?.id,
      });

      if (!receivedEvents.length) {
        receivedEvents =
          await productInventoryEventService.findLatestReceivedEvent({
            productInventoryId: productInventoryItems[0]?.id,
            businessLocationId: adjustment?.location?.id,
          });

        if (!receivedEvents.length) {
          handleLogger(
            'warn',
            'Resolver :: createDealTransactionInventoryShrinkage',
            `ReceivedEvents not found for product ${productId}`,
          );
        }
      }

      const lastReceivedEvent = receivedEvents[0];

      const cashPaymentMethod = await strapi.entityService.findMany(
        'api::payment-method.payment-method',
        {
          filters: {
            name: {
              $eq: 'cash',
            },
            tenant: {
              id: {
                $eq: adjustment?.tenant?.id,
              },
            },
          },
          fields: ['id'],
        },
      );

      await dealTransactionService.create({
        businessLocation: adjustment.location.id,
        tenant: adjustment.tenant.id,
        dueDate: adjustment.adjustmentDate,
        paymentMethod: cashPaymentMethod?.[0]?.id,
        status: 'Paid',
        chartAccount: chartInventoryShrinkage?.id,
        note: `Created due Adjustment ${adjustment?.adjustmentId}`,
        paid:
          Number(lastReceivedEvent?.itemCost ?? 0) * Number(adjustedQuantity),
        summary:
          Number(lastReceivedEvent?.itemCost ?? 0) * Number(adjustedQuantity),
        dealTransactionId: generateId(),
      });

      return { status: 'fulfilled', productId };
    } catch (error) {
      handleLogger(
        'error',
        'Resolver :: createDealTransactionInventoryShrinkage',
        `Error processing product ${productId}: ${error.message}`,
      );
      return { status: 'rejected', reason: error.message };
    }
  });

  const results = await Promise.allSettled(adjustmentItemPromises);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      handleLogger(
        'info',
        'Resolver :: createDealTransactionInventoryShrinkage',
        `Successfully processed product with index ${index}`,
      );
    } else if (result.status === 'rejected') {
      handleLogger(
        'warn',
        'Resolver :: createDealTransactionInventoryShrinkage',
        `Failed to process product with index ${index}: ${result.reason}`,
      );
    } else if (result.value?.status === 'skipped') {
      handleLogger(
        'warn',
        'Resolver :: createDealTransactionInventoryShrinkage',
        `Skipped product with index ${index}: ${result.value.reason}`,
      );
    }
  });
  return { status: 'success' };
};
