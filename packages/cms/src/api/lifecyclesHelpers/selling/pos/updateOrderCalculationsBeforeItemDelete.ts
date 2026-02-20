import AfterLifecycleEvent = Database.AfterLifecycleEvent;
import { handleLogger } from '../../../../graphql/helpers/errors';
export const updateOrderCalculationsBeforeItemDelete = async (
  { params, model },
  currentItemData,
) => {
  handleLogger(
    'info',
    'OrderItem updateOrderCalculationsBeforeItemDelete',
    `Params :: ${JSON.stringify(params)}`,
  );

  const apiName = model.uid;
  const entityId = params.where?.id;

  const orderService = strapi.service('api::order.order');

  const updatedOrder = orderService.getOrderWithoutItemToDelete(
    currentItemData.order,
    entityId,
    apiName,
  );
  const { subTotal, totalTax, totalDiscount } =
    orderService.getOrderFullCalculations(updatedOrder);
  const currentOrderTotal = Number(
    (
      +subTotal + +totalTax - +totalDiscount - currentItemData?.order?.points ??
      0
    ).toFixed(2),
  );

  return await strapi.entityService.update(
    'api::order.order',
    currentItemData?.order?.id,
    {
      data: {
        subTotal: subTotal,
        total: currentOrderTotal,
        tax: totalTax,
        discount: totalDiscount,
      },
    },
  );
};
