import { handleLogger } from '../../../graphql/helpers/errors';
import { appendUuid } from '../appendUuid';
import { LifecycleHook } from '../types';
import { appendUniqueRegexedIdForInventory } from './../inventory/appendUniqueRegexedIdForInventory';
import { checkIsNameOrBarcodeUnique } from './checkIsNameOrBarcodeUnique';

export const beforeCreateClassLifeCycleHook: LifecycleHook = async (event) => {
  handleLogger(
    'info',
    'Class beforeCreateClassLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await appendUuid({ ...event });
  await appendUniqueRegexedIdForInventory({ ...event });
  await checkIsNameOrBarcodeUnique({ ...event });
};
