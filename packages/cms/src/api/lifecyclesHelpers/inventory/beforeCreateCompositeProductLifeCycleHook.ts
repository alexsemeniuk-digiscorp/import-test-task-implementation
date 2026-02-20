import { handleLogger } from '../../../graphql/helpers/errors';
import { appendUuid } from '../appendUuid';
import { LifecycleHook } from '../types';

export const beforeCreateCompositeProductLifeCycleHook: LifecycleHook = async (
  event,
) => {
  handleLogger(
    'info',
    'CompositeProduct beforeCreateCompositeProductLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await appendUuid({ ...event });
};
