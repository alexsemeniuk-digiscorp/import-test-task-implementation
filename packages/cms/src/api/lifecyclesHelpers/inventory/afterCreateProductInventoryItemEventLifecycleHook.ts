import { handleLogger } from '../../../graphql/helpers/errors';
import { saleItemReportMarginGrossAndAgeUpdate } from '../reports/saleItemReportMarginGrossAndAgeUpdate';
import { LifecycleHook } from '../types';
import { createProductInventoryItemRecords } from './createProductInventoryItemRecords';

import AfterLifecycleEvent = Database.AfterLifecycleEvent;

export const afterCreateProductInventoryItemEventLifecycleHook: LifecycleHook =
  async (event: AfterLifecycleEvent) => {
    handleLogger(
      'info',
      'ProductInventoryItemEvent afterCreateProductInventoryItemEventLifecycleHook',
      `Params :: ${JSON.stringify(event?.params)}`,
    );

    await createProductInventoryItemRecords({ ...event });
    await saleItemReportMarginGrossAndAgeUpdate({ ...event });
  };
