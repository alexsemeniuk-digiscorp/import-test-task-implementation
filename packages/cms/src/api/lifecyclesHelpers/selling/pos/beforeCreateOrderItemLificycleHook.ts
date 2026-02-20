import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';
import { addDefaultPurchaseTax } from '../pos/addDefaultPurchaseTax';

export const beforeCreateOrderItemLifecycleHook: LifecycleHook = async (
  event,
) => {
  // Skip before create order item during bulk imports for performance
  if (event?.params?.data?._skipBeforeCreateOrderItem) {
    delete event?.params?.data?._skipBeforeCreateOrderItem;
    return;
  }

  handleLogger(
    'info',
    'ProductOrderItem beforeCreateLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  const orderId = event?.params?.data?.order;

  if (!orderId) return;

  const currentOrder = await strapi.entityService.findOne(
    'api::order.order',
    orderId,
    {
      fields: ['type'],
      populate: {
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  const orderType = currentOrder?.type;

  if (orderType === 'tradeIn' || orderType === 'purchase') {
    await addDefaultPurchaseTax(event, currentOrder);
  }
};
