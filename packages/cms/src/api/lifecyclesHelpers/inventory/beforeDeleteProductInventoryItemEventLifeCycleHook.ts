import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { deleteProductInventoryItemRecords } from './deleteProductInventoryItemRecords';
import { updateHistoryEventChangeSymbol } from './updateHistoryEventChangeSymbol';

export const beforeDeleteProductInventoryItemEventLifeCycleHook: LifecycleHook =
  async (event) => {
    handleLogger(
      'info',
      'ProductInventoryItemEvent beforeDeleteProductInventoryItemEventLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    await updateHistoryEventChangeSymbol({ ...event });
    await deleteProductInventoryItemRecords({ ...event });
  };
