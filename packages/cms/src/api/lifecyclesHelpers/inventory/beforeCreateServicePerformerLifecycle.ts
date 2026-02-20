import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';
import { setShopItemActiveStatus } from '../../lifecyclesHelpers/inventory/setShopItemActiveStatus';
import { appendUuid } from '../appendUuid';

export const beforeCreateServicePerformerLifecycle: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'ServicePerformer beforeCreateServicePerformerLifecycle',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await appendUuid({ ...event });
  await setShopItemActiveStatus({ ...event });
};
