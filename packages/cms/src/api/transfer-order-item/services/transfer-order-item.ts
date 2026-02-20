/**
 * transfer-order-item service
 */
import { factories } from '@strapi/strapi';
import { difference } from 'lodash';
import { handleLogger } from '../../../graphql/helpers/errors';
import { NexusGenEnums } from '../../../types/generated/graphql';

export default factories.createCoreService(
  'api::transfer-order-item.transfer-order-item',
  () => ({
    async updatingProductInventoryItems({
      transferOrderItem,
      productInventoryItemFrom,
      productInventoryItemTo,
      currentOrder,
      ctx,
      serializes,
    }) {
      handleLogger(
        'info',
        'Service :: updatingProductInventoryItems',
        `Params: TransferOrderItem ${JSON.stringify(
          transferOrderItem,
        )}, ProductInventoryItemFrom ${JSON.stringify(
          productInventoryItemFrom,
        )}, ProductInventoryItemTo ${JSON.stringify(
          productInventoryItemTo,
        )}, CurrentOrder ${JSON.stringify(
          currentOrder,
        )}, Serializes ${JSON.stringify(serializes)}`,
      );

      const serialNumbersFrom = productInventoryItemFrom.serializes.map(
        (item) => String(item.id),
      );
      const serialNumbersTo = serializes;

      const productInventoryEventService = strapi.service(
        'api::product-inventory-item-event.product-inventory-item-event',
      );

      const { updatedFromReceiveEvents, newReceiveEvents } =
        await productInventoryEventService.transferReceiveEvents({
          productItemId: productInventoryItemFrom.id,
          transferQuantity: transferOrderItem.transferQuantity,
        });

      const updateData = async (
        productInventoryItem,
        transferOrderItem,
        currentOrder,
        operator,
      ) => {
        if (!productInventoryItem) {
          const { product, tenant } = productInventoryItemFrom;

          await strapi.entityService
            .create('api::product-inventory-item.product-inventory-item', {
              data: {
                quantity: Number(transferOrderItem.transferQuantity),
                serializes: serialNumbersTo,
                businessLocation: currentOrder.locationTo.id,
                product: product.id,
                tenant: tenant.id,
                maxQuantity: 100,
                storageNotes: `Created with transfer order on: ${new Date()}`,
              },
            })
            .then(async (result) => {
              await Promise.all(
                newReceiveEvents.map(
                  async (event) =>
                    await strapi.entityService.create(
                      'api::product-inventory-item-event.product-inventory-item-event',
                      {
                        data: {
                          ...event,
                          productInventoryItem: result.id,
                          addedBy: ctx.state.user.id,
                          businessLocation: currentOrder.locationTo.id,
                        },
                      },
                    ),
                ),
              );

              await strapi.entityService.create(
                'api::product-inventory-item-event.product-inventory-item-event',
                {
                  data: {
                    eventType: 'transfer in',
                    change: transferOrderItem.transferQuantity.toString(),
                    productInventoryItem: result.id,
                    relationUuid: currentOrder?.uuid,
                    addedBy: ctx.state.user.id,
                    businessLocation: currentOrder.locationTo.id,
                    tenant: tenant.id,
                  },
                },
              );
            });
        }

        if (productInventoryItem) {
          const { transferQuantity } = transferOrderItem;
          let newQuantity;

          const productItemToReceiveEvents =
            await strapi.entityService.findMany(
              'api::product-inventory-item-event.product-inventory-item-event',
              {
                filters: {
                  productInventoryItem: {
                    id: {
                      $eq: productInventoryItem.id,
                    },
                  },
                  businessLocation: {
                    id: {
                      $eq: currentOrder.locationTo.id,
                    },
                  },
                  eventType: {
                    $eq: 'receive' as NexusGenEnums['ENUM_PRODUCTINVENTORYITEMEVENT_EVENTTYPE'],
                  },
                },
                sort: ['receiveDate:asc'],
                fields: [
                  'id',
                  'itemCost',
                  'receiveDate',
                  'memo',
                  'remainingQuantity',
                  'change',
                ],
                populate: {
                  itemVendor: {
                    fields: ['id'],
                  },
                  itemContactVendor: {
                    fields: ['id'],
                  },
                  tenant: {
                    fields: ['id'],
                  },
                },
              },
            );

          switch (operator) {
            case '+':
              newQuantity = productInventoryItem.quantity + transferQuantity;

              await Promise.all(
                newReceiveEvents.map(async (newEvent) => {
                  const matchingEvent = productItemToReceiveEvents.find(
                    (event) =>
                      event.itemCost === newEvent.itemCost &&
                      event?.itemVendor?.id === newEvent.itemVendor &&
                      event?.itemContactVendor?.id ===
                        newEvent.itemContactVendor &&
                      event.receiveDate === newEvent.receiveDate &&
                      event.memo === newEvent.memo,
                  );

                  if (matchingEvent) {
                    matchingEvent.remainingQuantity +=
                      newEvent.remainingQuantity;
                    matchingEvent.change = (
                      Number(matchingEvent.change) + Number(newEvent.change)
                    ).toString();

                    await strapi.entityService.update(
                      'api::product-inventory-item-event.product-inventory-item-event',
                      matchingEvent.id,
                      {
                        data: {
                          remainingQuantity: matchingEvent.remainingQuantity,
                          change: matchingEvent.change,
                        },
                      },
                    );
                  } else {
                    await strapi.entityService.create(
                      'api::product-inventory-item-event.product-inventory-item-event',
                      {
                        data: {
                          ...newEvent,
                          productInventoryItem: productInventoryItem.id,
                          addedBy: ctx.state.user.id,
                          businessLocation:
                            productInventoryItem.businessLocation.id,
                        },
                      },
                    );
                  }
                }),
              );

              await strapi.entityService.create(
                'api::product-inventory-item-event.product-inventory-item-event',
                {
                  data: {
                    eventType: 'transfer in',
                    change: transferOrderItem.transferQuantity.toString(),
                    productInventoryItem: productInventoryItem.id,
                    relationUuid: currentOrder?.uuid,
                    addedBy: ctx.state.user.id,
                    businessLocation: productInventoryItem.businessLocation.id,
                    tenant: productInventoryItem.tenant.id,
                  },
                },
              );
              break;
            case '-':
              newQuantity = productInventoryItem.quantity - transferQuantity;

              await Promise.all(
                updatedFromReceiveEvents.map((event) => {
                  if (Number(event.change) === 0) {
                    return strapi.entityService.delete(
                      'api::product-inventory-item-event.product-inventory-item-event',
                      event.id,
                    );
                  } else {
                    return strapi.entityService.update(
                      'api::product-inventory-item-event.product-inventory-item-event',
                      event.id,
                      {
                        data: {
                          remainingQuantity: event.remainingQuantity,
                          change: event.change,
                        },
                      },
                    );
                  }
                }),
              );

              await strapi.entityService.create(
                'api::product-inventory-item-event.product-inventory-item-event',
                {
                  data: {
                    eventType: 'transfer out',
                    change: transferOrderItem.transferQuantity.toString(),
                    productInventoryItem: productInventoryItem.id,
                    relationUuid: currentOrder?.uuid,
                    addedBy: ctx.state.user.id,
                    businessLocation: productInventoryItem.businessLocation.id,
                    tenant: productInventoryItem.tenant.id,
                  },
                },
              );
              break;
            default:
              return;
          }

          await strapi.entityService.update(
            'api::product-inventory-item.product-inventory-item',
            productInventoryItem.id,
            {
              data: {
                quantity: newQuantity,
                serializes: difference(serialNumbersFrom, serialNumbersTo),
              },
            },
          );
        }
      };

      await Promise.all([
        updateData(
          productInventoryItemFrom,
          transferOrderItem,
          currentOrder,
          '-',
        ),
        updateData(
          productInventoryItemTo,
          transferOrderItem,
          currentOrder,
          '+',
        ),
      ]);
    },
  }),
);
