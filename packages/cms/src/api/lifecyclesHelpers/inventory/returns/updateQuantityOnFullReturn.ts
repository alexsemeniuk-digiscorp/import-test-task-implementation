import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';

// When return type is full, update the quantity of all the product order items
export const updateQuantityOnFullReturn: LifecycleHook = async ({ params }) => {
  handleLogger(
    'info',
    'Lifecycle :: updateQuantityOnFullReturn',
    `Params ${JSON.stringify(params)}`,
  );
  const { type, order, uuid, sublocation, businessLocation } = params.data;

  if (type !== 'full' || !order) {
    return;
  }

  const returnService = strapi.service('api::return.return');

  await returnService.processFullReturn({
    orderId: order,
    uuid,
    sublocation,
  });
};
