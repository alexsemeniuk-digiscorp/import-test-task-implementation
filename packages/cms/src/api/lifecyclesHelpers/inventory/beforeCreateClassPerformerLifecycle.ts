import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';
import { setShopItemActiveStatus } from '../../lifecyclesHelpers/inventory/setShopItemActiveStatus';
import { appendUuid } from '../appendUuid';

export const beforeCreateClassPerformerLifecycle: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'ClassPerformer beforeCreateClassPerformerLifecycle',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await appendUuid({ ...event });
  await setShopItemActiveStatus({ ...event });
};
