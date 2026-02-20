import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { checkIsNameOrBarcodeUnique } from './checkIsNameOrBarcodeUnique';
import { updateProductInventoryItemRecordsOnProductUpdate } from './updateProductInventoryItemRecordsOnProductUpdate';
import { updateShopItemActiveStatus } from './updateShopItemActiveStatus';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateProductLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'Product beforeUpdateProductLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await updateShopItemActiveStatus({ ...event });
  await checkIsNameOrBarcodeUnique({ ...event });
  await updateProductInventoryItemRecordsOnProductUpdate({ ...event });
};
