import { handleLogger } from '../../../../graphql/helpers/errors';

export const updateOrderCalculationsAfterItemUpdate = async (
  event,
  currentItemData,
) => {
  handleLogger(
    'info',
    'OrderItem updateOrderCalculationsAfterItemUpdate',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  if (!currentItemData?.order) return;

  const orderService = strapi.service('api::order.order');

  const { subTotal, totalTax, totalDiscount } =
    orderService.getOrderFullCalculations(currentItemData?.order);
  const currentOrderTotal = Number(
    (
      +subTotal + +totalTax - +totalDiscount - currentItemData?.order?.points ??
      0
    ).toFixed(2),
  );

  // Skip after before order during bulk imports for performance
  const shouldSkipBeforeUpdateOrder = event?.params?.data
    ?._skipBeforeUpdateOrder
    ? {
        _skipBeforeUpdateOrder: true,
      }
    : {};

  // Skip after update order during bulk imports for performance
  const shouldSkipAfterUpdateOrder = event?.params?.data?._skipAfterUpdateOrder
    ? {
        _skipAfterUpdateOrder: true,
      }
    : {};

  // Skip meilisearch sync during bulk imports for performance
  const shouldSkipMeilisearchSync = event?.params?.data?._skipMeilisearchSync
    ? {
        _skipMeilisearchSync: true,
      }
    : {};

  await strapi.entityService.update(
    'api::order.order',
    currentItemData?.order?.id,
    {
      data: {
        subTotal: +subTotal,
        total: currentOrderTotal,
        tax: totalTax,
        discount: totalDiscount,
        ...shouldSkipBeforeUpdateOrder,
        ...shouldSkipAfterUpdateOrder,
        ...shouldSkipMeilisearchSync,
      },
    },
  );

  if (event?.params?.data?._skipBeforeUpdateOrder) {
    delete event?.params?.data?._skipBeforeUpdateOrder;
    return;
  }

  if (event?.params?.data?._skipAfterUpdateOrder) {
    delete event?.params?.data?._skipAfterUpdateOrder;
    return;
  }
};
