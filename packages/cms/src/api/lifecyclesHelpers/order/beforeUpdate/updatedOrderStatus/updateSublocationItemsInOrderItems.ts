import {
  handleError,
  handleLogger,
} from '../../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateSublocationItemsInOrderItems = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'Lifecycle helper :: updateSublocationItemsInOrderItems',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const orderProducts = currentOrder.products;
  const promisesSublocationItems = orderProducts
    .map((item) => {
      const inventoryProductQnty = item.product.quantity;

      //if ProductInventoryItem <=1  - remove sublocationItems with this ProductInventoryItem
      if (inventoryProductQnty <= 1) {
        const sublocationItems = item?.product?.sublocationItems;
        if (!sublocationItems)
          handleError(
            'Lifecycle helper :: updateSublocationItemsInOrderItems',
            `SublocationItems with ProductInventoryItem ${item?.product?.id} not found`,
          );

        return sublocationItems?.map((subItem) => {
          return strapi.entityService.delete(
            'api::sublocation-item.sublocation-item',
            subItem?.id,
          );
        });
      }
    })
    .flat();

  const sublocationsResults = await Promise.allSettled(
    promisesSublocationItems,
  );
  sublocationsResults.forEach((result) => {
    if (result.status === 'rejected') {
      handleError(
        'Lifecycle helper :: updateSublocationItemsInOrder',
        `PromiseAll UpdSublocations ${result.reason}`,
      );
    }
  });
};
