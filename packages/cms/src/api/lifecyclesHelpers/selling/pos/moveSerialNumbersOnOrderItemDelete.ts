import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { concat } from 'lodash';
import { handleLogger } from '../../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const moveSerialNumbersOnOrderItemDelete = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'ProductOrderItem beforeDeleteOrderItemLifeCycleHook moveSerialNumbersOnOrderItemDelete',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const productInventoryItemServices = strapi.service(
    'api::product-inventory-item.product-inventory-item',
  );

  const inventorySerialNumbers = currentItemData.product?.serializes?.map(
    (item) => String(item.id),
  );
  const orderItemSerialNumbers = currentItemData?.serializes?.map((item) =>
    String(item.id),
  );

  await productInventoryItemServices.update(currentItemData.product.id, {
    data: {
      serializes: concat(
        inventorySerialNumbers,
        orderItemSerialNumbers,
      ) as ID[],
    },
  });
};
