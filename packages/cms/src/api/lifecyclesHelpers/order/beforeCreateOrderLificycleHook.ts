import { handleLogger } from '../../../graphql/helpers/errors';
import { appendRegexedId } from '../appendRegexedId';
import { LifecycleHook } from '../types';

export const beforeCreateOrderLifecycleHook: LifecycleHook = async (event) => {
  handleLogger(
    'info',
    'ORDER beforeCreateLifecycleHook',
    `Params :: ${JSON.stringify(event?.params)}`,
  );

  event.params.data.customCreationDate =
    event.params.data.customCreationDate || new Date().toISOString();

  await appendRegexedId({ ...event });
};
