import { handleLogger } from '../../../graphql/helpers/errors';
import { LifecycleHook } from '../types';
import { checkIsNameOrBarcodeUnique } from './checkIsNameOrBarcodeUnique';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateMembershipLifeCycleHook: LifecycleHook = async (
  event: BeforeLifecycleEvent,
) => {
  handleLogger(
    'info',
    'Membership beforeUpdateMembershipLifeCycleHook',
    `Params :: ${JSON.stringify(event.params)}`,
  );

  await checkIsNameOrBarcodeUnique({ ...event });
};
