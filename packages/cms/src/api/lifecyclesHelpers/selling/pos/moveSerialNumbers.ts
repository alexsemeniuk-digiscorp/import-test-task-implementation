import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { concat, difference, intersection } from 'lodash';
import { handleLogger } from '../../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const moveSerialNumbers = async (
  event: BeforeLifecycleEvent,
  currentItemData,
  entitySerialNumbers,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeUpdateOrderItemLifeCycleHook moveSerialNumbers',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const inventorySerialNumbers = currentItemData.product?.serializes?.map(
    (item) => String(item.id),
  );
  const orderItemSerialNumbers = currentItemData?.serializes?.map((item) =>
    String(item.id),
  );

  const movedSerialNumbersFromItemToOrder = intersection(
    entitySerialNumbers,
    inventorySerialNumbers,
  );

  const movedSerialNumbersFromOrderToItem = difference(
    orderItemSerialNumbers,
    entitySerialNumbers,
  );

  if (movedSerialNumbersFromItemToOrder.length > 0) {
    const newSerialNumbersForItem = difference(
      inventorySerialNumbers,
      movedSerialNumbersFromItemToOrder,
    );

    await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      currentItemData.product.id,
      {
        data: {
          serializes: newSerialNumbersForItem as ID[],
        },
      },
    );
  }

  if (movedSerialNumbersFromOrderToItem.length > 0) {
    await strapi.entityService.update(
      'api::product-inventory-item.product-inventory-item',
      currentItemData.product.id,
      {
        data: {
          serializes: concat(
            inventorySerialNumbers,
            movedSerialNumbersFromOrderToItem,
          ) as ID[],
        },
      },
    );
  }
};
