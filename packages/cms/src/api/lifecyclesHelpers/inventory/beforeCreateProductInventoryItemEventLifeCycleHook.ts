import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { updateHistoryEventChangeSymbol } from './updateHistoryEventChangeSymbol';

export const beforeCreateProductInventoryItemEventLifeCycleHook: LifecycleHook =
  async (event) => {
    handleLogger(
      'info',
      'ProductInventoryItemEvent beforeCreateProductInventoryItemEventLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    if (event?.params?.data?.change) {
      await updateHistoryEventChangeSymbol({ ...event });
    }
  };
