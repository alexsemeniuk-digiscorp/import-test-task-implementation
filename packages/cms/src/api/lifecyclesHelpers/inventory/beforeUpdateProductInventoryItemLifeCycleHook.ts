import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { processProductInventoryItemQuantityUpdate } from './processProductInventoryItemQuantityUpdate';
import { updateProductInventoryItemRecordsOnProductInventoryItemUpdate } from './updateProductInventoryItemRecordsOnProductInventoryItemUpdate';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateProductInventoryItemLifeCycleHook: LifecycleHook =
  async (event: BeforeLifecycleEvent) => {
    // Skip before update product inventory item during bulk imports for performance
    if (event?.params?.data?._skipBeforeUpdateProductInventoryItem) {
      delete event?.params?.data?._skipBeforeUpdateProductInventoryItem;
      return;
    }

    handleLogger(
      'info',
      'ProductInventoryItem beforeUpdateProductInventoryItemLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    await processProductInventoryItemQuantityUpdate({ ...event });
    await updateProductInventoryItemRecordsOnProductInventoryItemUpdate({
      ...event,
    });
  };
