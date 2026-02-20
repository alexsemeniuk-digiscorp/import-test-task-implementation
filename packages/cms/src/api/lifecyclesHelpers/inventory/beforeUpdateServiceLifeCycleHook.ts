import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { checkIsNameOrBarcodeUnique } from './checkIsNameOrBarcodeUnique';
import { updateShopItemActiveStatus } from './updateShopItemActiveStatus';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateServiceLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'Service beforeUpdateServiceLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await updateShopItemActiveStatus({ ...event });
  await checkIsNameOrBarcodeUnique({ ...event });
};
