import { handleLogger } from '../../../../graphql/helpers/errors';
import { LifecycleHook } from '../../types';
import { deleteOrderItemOnReturnItemCreate } from './deleteOrderItemOnReturnItemCreate';

export const beforeCreateReturnItemLifecycleHook: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'RETURN ITEM beforeCreateReturnItemLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  await deleteOrderItemOnReturnItemCreate({ ...event });
};
