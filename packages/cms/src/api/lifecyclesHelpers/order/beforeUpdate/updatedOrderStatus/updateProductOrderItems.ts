import {
  handleError,
  handleLogger,
} from '../../../../../graphql/helpers/errors';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const updateProductOrderItems = async (
  event: BeforeLifecycleEvent,
  currentOrder,
) => {
  handleLogger(
    'info',
    'Lifecycle helper :: updateProductOrderItems',
    `Params: ${JSON.stringify(event.params)}`,
  );

  const productOrderItemService = strapi.service(
    'api::product-order-item.product-order-item',
  );
  const orderProducts = currentOrder.products;

  const promisesProductOrderItem = orderProducts.map((item) => {
    return productOrderItemService.update(item.id, {
      sublocationItems: [],
      sublocations: [],
      serializes: [],
    });
  });

  const productOrderItemsResults = await Promise.allSettled(
    promisesProductOrderItem,
  );
  productOrderItemsResults.forEach((result) => {
    if (result.status === 'rejected') {
      handleError(
        'Lifecycle helper :: updateProductOrderItems',
        `PromiseAll UpdProductOrderItem ${result.reason}`,
      );
    }
  });
};
