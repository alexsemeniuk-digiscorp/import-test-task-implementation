import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;
import { handleLogger } from '../../../../graphql/helpers/errors';

export const deleteProductOrderItemsFromComposite = async (
  event: BeforeLifecycleEvent,
  currentItemData,
) => {
  handleLogger(
    'info',
    'CompositeProductOrderItem beforeDeleteCompositeProductOrderItemLifeCycleHook deleteProductOrderItemsFromComposite',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  const productOrderItemsInsideComposite = currentItemData?.productOrderItems;

  if (!productOrderItemsInsideComposite?.length) return;

  await Promise.all(
    productOrderItemsInsideComposite?.map(async (productOrderItem) => {
      await strapi.entityService.delete(
        'api::product-order-item.product-order-item',
        productOrderItem?.id,
      );
    }),
  );
};
