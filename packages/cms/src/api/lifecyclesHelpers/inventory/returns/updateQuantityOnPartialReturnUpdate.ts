import { LifecycleHook } from '../../types';

// When return type is updated to partial, revert the return of all previously returned items
export const updateQuantityOnPartialReturnUpdate: LifecycleHook = async ({
  params,
}) => {
  const { type, order, uuid } = params.data;

  if (type !== 'partial' || !order) {
    return;
  }

  const returnService = strapi.service('api::return.return');

  await returnService.processFullReturn({
    orderId: order,
    revert: true,
    uuid,
  });
};
