import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';
import { setShopItemActiveStatus } from '../../lifecyclesHelpers/inventory/setShopItemActiveStatus';

export const beforeCreateCompositeProductLocationInfoLifecycle: LifecycleHook =
  async (event) => {
    handleLogger(
      'info',
      'CompositeProductLocationInfo beforeCreateCompositeProductLocationInfoLifecycle',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    await setShopItemActiveStatus({ ...event });
  };
