import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { updateShopItemActiveStatus } from './updateShopItemActiveStatus';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateCompositeProductLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'CompositeProduct beforeUpdateCompositeProductLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await updateShopItemActiveStatus({ ...event });
};
