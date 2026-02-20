/**
 * product-inventory-item-event service
 */

import { factories } from '@strapi/strapi';
import { AnyObject } from '../../../graphql/helpers/types';

export default factories.createCoreService(
  'api::product-inventory-item-event.product-inventory-item-event',
  ({ strapi }) => ({
    async findOne(id: number, params?: AnyObject) {
      return await strapi.entityService.findOne(
        'api::product-inventory-item-event.product-inventory-item-event',
        id,
        {
          ...params,
        },
      );
    },
    async findMany(params: AnyObject) {
      return await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          ...params,
        },
      );
    },
    async create(create: AnyObject) {
      return await strapi.entityService.create(
        'api::product-inventory-item-event.product-inventory-item-event',
        { data: { ...create } },
      );
    },
    async delete(id: number) {
      return await strapi.entityService.delete(
        'api::product-inventory-item-event.product-inventory-item-event',
        id,
      );
    },
    async update(id: number, update: AnyObject) {
      return await strapi.entityService.update(
        'api::product-inventory-item-event.product-inventory-item-event',
        id,
        { data: { ...update } },
      );
    },
    async findManyReceived({
      productInventoryId,
      businessLocationId,
    }: {
      productInventoryId: number;
      businessLocationId?: number;
    }) {
      return await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productInventoryId,
              },
            },
            ...(businessLocationId && {
              businessLocations: {
                id: {
                  $eq: businessLocationId,
                },
              },
            }),
            eventType: {
              $eq: 'receive',
            },
            remainingQuantity: {
              $ne: 0,
            },
          },
          sort: ['receiveDate:asc'],
        },
      );
    },
    async findLatestReceivedEvent({
      productInventoryId,
      businessLocationId,
    }: {
      productInventoryId: number;
      businessLocationId?: number;
    }) {
      const results = await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            productInventoryItem: {
              id: { $eq: productInventoryId },
            },
            ...(businessLocationId && {
              businessLocations: {
                id: { $eq: businessLocationId },
              },
            }),
            eventType: { $eq: 'receive' },
          },
          sort: ['createdAt:desc'],
          limit: 1,
        },
      );

      return results[0] || null;
    },
    async removeRemainingInReceiveEvents({
      productItemId,
      transferQuantity,
    }: {
      productItemId: number;
      transferQuantity: number;
    }) {
      const productItemReceiveEvents = await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productItemId,
              },
            },
            eventType: {
              $eq: 'receive',
            },
            remainingQuantity: {
              $ne: 0,
            },
          },
          sort: ['receiveDate:asc'],
        },
      );

      let canceledReturnQuantity = transferQuantity;

      const updatedReceiveEvents = productItemReceiveEvents.map(
        (receiveEvent) => {
          if (canceledReturnQuantity > 0) {
            const deduction = Math.min(
              receiveEvent.remainingQuantity,
              canceledReturnQuantity,
            );
            receiveEvent.remainingQuantity -= deduction;
            canceledReturnQuantity -= deduction;
          }
          return receiveEvent;
        },
      );

      return { updatedReceiveEvents };
    },

    async addRemainingInReceiveEvents({
      productItemId,
      transferQuantity,
    }: {
      productItemId: number;
      transferQuantity: number;
    }) {
      const productItemReceiveEvents = await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productItemId,
              },
            },
            eventType: {
              $eq: 'receive',
            },
          },
          sort: ['receiveDate:desc'],
        },
      );
      let remainingQuantityToAdd = transferQuantity;

      const updatedReceiveEvents = productItemReceiveEvents.map(
        (receiveEvent) => {
          const { change, remainingQuantity } = receiveEvent;

          if (remainingQuantityToAdd > 0) {
            const availableSpace = Number(change) - remainingQuantity;
            const addition = Math.min(availableSpace, remainingQuantityToAdd);
            receiveEvent.remainingQuantity += addition;
            remainingQuantityToAdd -= addition;
          }
          return receiveEvent;
        },
      );

      return { updatedReceiveEvents };
    },

    async transferReceiveEvents({
      productItemId,
      transferQuantity,
    }: {
      productItemId: number;
      transferQuantity: number;
    }) {
      const receiveEventType = 'receive';

      const productItemReceiveEvents = await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productItemId,
              },
            },
            eventType: {
              $eq: receiveEventType as 'receive',
            },
            remainingQuantity: {
              $ne: 0,
            },
          },
          sort: ['receiveDate:asc'],
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

      let remainingTransferQuantity = transferQuantity;

      const updatedFromReceiveEvents = productItemReceiveEvents.map((event) => {
        const { change, remainingQuantity } = event;

        if (remainingTransferQuantity > 0) {
          if (remainingQuantity <= remainingTransferQuantity) {
            remainingTransferQuantity -= remainingQuantity;
            return {
              ...event,
              remainingQuantity: 0,
              change: (Number(change) - remainingQuantity).toString(),
            };
          } else {
            const updatedEvent = {
              ...event,
              remainingQuantity: remainingQuantity - remainingTransferQuantity,
              change: (Number(change) - remainingTransferQuantity).toString(),
            };
            remainingTransferQuantity = 0;
            return updatedEvent;
          }
        }
        return event;
      });

      const newReceiveEvents = productItemReceiveEvents
        .map((event) => {
          const {
            eventType,
            itemCost,
            itemVendor,
            laidAway,
            memo,
            expiryDate,
            receiveDate,
            remainingQuantity,
            tenant,
            itemContactVendor,
          } = event;
          const change = Math.min(remainingQuantity, transferQuantity);
          transferQuantity -= change;

          return {
            change: change.toString(),
            remainingQuantity: change,
            eventType,
            expiryDate,
            receiveDate,
            itemCost,
            memo,
            laidAway,
            itemVendor: itemVendor ? itemVendor.id : undefined,
            itemContactVendor: itemContactVendor
              ? itemContactVendor.id
              : undefined,
            tenant: tenant.id,
          };
        })
        .filter((event) => event.change !== '0');

      return { updatedFromReceiveEvents, newReceiveEvents };
    },

    async getItemCostArray({
      productItemId,
      transferQuantity,
      isImportedItem = false,
    }: {
      productItemId: number;
      transferQuantity: number;
      isImportedItem: boolean;
    }) {
      const productItemReceiveEvents = await strapi.entityService.findMany(
        'api::product-inventory-item-event.product-inventory-item-event',
        {
          filters: {
            productInventoryItem: {
              id: {
                $eq: productItemId,
              },
            },
            eventType: {
              $eq: 'receive',
            },
          },
          sort: ['receiveDate:desc'],
          populate: {
            itemVendor: {
              fields: ['id'],
            },
            itemContactVendor: {
              fields: ['id'],
            },
          },
        },
      );

      const initialItemCostArray = [];
      const initialReceiveDateArray = [];
      const initialVendorArray = [];
      const initialMemoTakenArray = [];
      const initialEventsArray = [];

      productItemReceiveEvents.map((event) => {
        const changeValue = parseInt(event.change) - event.remainingQuantity;
        const changeQuantity = Math.abs(changeValue);

        if (changeQuantity > 0 && transferQuantity > 0) {
          const addTimes = Math.min(changeQuantity, transferQuantity);

          Array.from({ length: addTimes }).map(() => {
            initialItemCostArray.push(event.itemCost);
            initialReceiveDateArray.push(event.receiveDate);
            initialVendorArray.push(event);
            initialMemoTakenArray.push(event.memo);
            initialEventsArray.push(event.id);
          });

          transferQuantity -= addTimes;
        } else if (
          isImportedItem &&
          productItemReceiveEvents?.length === 1 &&
          changeQuantity === 0
        ) {
          Array.from({ length: transferQuantity ? transferQuantity : 1 }).map(
            () => {
              initialItemCostArray.push(event.itemCost);
              initialReceiveDateArray.push(event.receiveDate);
              initialVendorArray.push(event);
              initialMemoTakenArray.push(event.memo);
              initialEventsArray.push(event.id);
            },
          );
        }

        return event;
      });

      const itemCostArray = initialItemCostArray.reverse();
      const receiveDateArray = initialReceiveDateArray.reverse();
      const vendorArray = initialVendorArray.reverse();
      const memoTakenArray = initialMemoTakenArray.reverse();
      const eventsArray = initialEventsArray.reverse();

      return {
        itemCostArray,
        receiveDateArray,
        vendorArray,
        memoTakenArray,
        eventsArray,
      };
    },

    getProductInventoryItemEventGrossMargin(
      productInventoryItemEvent,
      newItemPrice = undefined,
      newMultiplier = undefined,
      newDefaultPrice = undefined,
      newItemCost = undefined,
    ) {
      const inventoryItemPrice =
        newItemPrice ??
        productInventoryItemEvent?.productInventoryItem?.price ??
        0;

      const productItemCost =
        newItemCost ?? productInventoryItemEvent?.itemCost ?? 0;
      const productMultiplier =
        newMultiplier ??
        productInventoryItemEvent?.productInventoryItem?.product?.multiplier ??
        0;
      const multipliedPrice = productItemCost * productMultiplier ?? 0;

      const productPrice =
        newDefaultPrice ??
        productInventoryItemEvent?.productInventoryItem?.product
          ?.defaultPrice ??
        0;

      const itemPrice = inventoryItemPrice || multipliedPrice || productPrice;

      if (itemPrice === 0) {
        return {
          calculatedGrossMargin: parseFloat((0).toFixed(2)),
          calculatedItemPrice: parseFloat((0).toFixed(2)),
        };
      }

      const calculatedGrossMargin =
        ((itemPrice - productItemCost) / itemPrice) * 100;

      return {
        calculatedGrossMargin: parseFloat(calculatedGrossMargin.toFixed(2)),
        calculatedItemPrice: parseFloat(itemPrice.toFixed(2)),
      };
    },

    getProductInventoryItemEventAge(productInventoryItemEvent) {
      const receiveDate = new Date(productInventoryItemEvent?.receiveDate);
      const currentDate = new Date();

      const differenceInMilliseconds =
        currentDate.getTime() - receiveDate.getTime();
      const ageInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      return Math.round(ageInDays);
    },
  }),
);
