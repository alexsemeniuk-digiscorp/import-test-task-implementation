import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { difference, isEmpty } from 'lodash';
import { LifecycleHook } from '../types';

export const updateProductItemOnAdjustment: LifecycleHook = async ({
  params,
  result,
}) => {
  const { inventoryAdjustment, serializes } = params.data;

  const ctx = strapi.requestContext.get();

  const entity = await strapi.entityService.findOne(
    'api::inventory-adjustment-item.inventory-adjustment-item',
    result.id,
    {
      fields: ['id', 'adjustedQuantity', 'quantityLeft'],
      populate: {
        product: {
          fields: ['id'],
        },
      },
    },
  );

  const currentInventoryAdjustment = await strapi.entityService.findOne(
    'api::inventory-adjustment.inventory-adjustment',
    inventoryAdjustment,
    {
      fields: ['id', 'uuid'],
      populate: {
        location: {
          fields: ['id'],
        },
      },
    },
  );

  const productItem = await strapi.entityService.findMany(
    'api::product-inventory-item.product-inventory-item',
    {
      filters: {
        product: {
          id: {
            $eq: entity.product.id,
          },
        },
        businessLocation: {
          id: {
            $eq: currentInventoryAdjustment.location.id,
          },
        },
      },
      fields: ['id'],
      populate: {
        businessLocation: {
          fields: ['id'],
        },
        serializes: {
          fields: ['id'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  if (!isEmpty(serializes)) {
    const productInventoryItemSerializes = productItem[0].serializes.map(
      (item) => String(item.id),
    );

    const movedArr = difference(productInventoryItemSerializes, serializes);

    await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      productItem[0].id,
      {
        data: {
          serializes: movedArr as ID[],
        },
      },
    );
  }

  const productInventoryEventService = strapi.service(
    'api::product-inventory-item-event.product-inventory-item-event',
  );

  const { updatedReceiveEvents } =
    await productInventoryEventService.removeRemainingInReceiveEvents({
      productItemId: productItem[0].id,
      transferQuantity: entity.adjustedQuantity,
    });

  await strapi.entityService.update(
    'api::product-inventory-item.product-inventory-item',
    productItem[0].id,
    {
      data: {
        quantity: entity.quantityLeft ? entity.quantityLeft : 0,
      },
    },
  );

  if (entity.adjustedQuantity > 0) {
    await strapi.entityService.create(
      'api::product-inventory-item-event.product-inventory-item-event',
      {
        data: {
          eventType: 'adjustment',
          change: entity.adjustedQuantity.toString(),
          productInventoryItem: productItem[0].id,
          relationUuid: currentInventoryAdjustment?.uuid,
          addedBy: ctx.state.user.id,
          businessLocation: productItem[0].businessLocation.id,
          tenant: productItem[0].tenant.id,
        },
      },
    );
  }

  await Promise.all(
    updatedReceiveEvents.map(
      async (receiveEvent) =>
        await strapi.entityService.update(
          'api::product-inventory-item-event.product-inventory-item-event',
          receiveEvent.id,
          {
            data: {
              remainingQuantity: receiveEvent.remainingQuantity,
            },
          },
        ),
    ),
  );
};
