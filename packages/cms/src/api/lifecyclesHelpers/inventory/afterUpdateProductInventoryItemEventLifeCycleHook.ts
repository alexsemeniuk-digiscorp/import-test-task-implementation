import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { updateProductOrderItemPriceOnEventItemCostUpdate } from './updateProductOrderItemPriceOnEventItemCostUpdate';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const afterUpdateProductInventoryItemEventLifeCycleHook: LifecycleHook =
  async (event: BeforeLifecycleEvent) => {
    // Skip after update product inventory item event during bulk imports for performance
    if (event?.params?.data?._skipAfterUpdateProductInventoryItemEvent) {
      delete event?.params?.data?._skipAfterUpdateProductInventoryItemEvent;
      return;
    }

    handleLogger(
      'info',
      'ProductInventoryItemEvent afterUpdateProductInventoryItemEventLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    await updateProductOrderItemPriceOnEventItemCostUpdate({ ...event });
  };
