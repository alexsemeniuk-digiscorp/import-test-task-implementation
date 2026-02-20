import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';
import { addDefaultPurchaseTax } from '../pos/addDefaultPurchaseTax';

export const beforeCreateCompositeProductOrderItemLifecycleHook: LifecycleHook =
  async (event) => {
    handleLogger(
      'info',
      'CompositeProductOrderItem beforeCreateLifecycleHook',
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
