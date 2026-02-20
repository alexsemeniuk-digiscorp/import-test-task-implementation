import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';
import { appendCustomCreationDate } from '../../lifecyclesHelpers/appendCustomCreationDate';
import { setShopItemActiveStatus } from '../../lifecyclesHelpers/inventory/setShopItemActiveStatus';
import { appendUuid } from '../appendUuid';

export const beforeCreateProductInventoryItemLifecycle: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'ProductInventoryItem beforeCreateProductInventoryItemLifecycle',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await appendUuid({ ...event });
  await appendCustomCreationDate({ ...event });
  await setShopItemActiveStatus({ ...event });
};
