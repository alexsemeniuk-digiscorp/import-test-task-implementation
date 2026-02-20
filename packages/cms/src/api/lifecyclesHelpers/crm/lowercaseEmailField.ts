import { LifecycleHook } from '../types';
import { handleLogger } from './../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const lowercaseEmailField: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  handleLogger(
    'info',
    'CONTACT lowercaseEmailField',
    `Params :: ${JSON.stringify(params)}`,
  );
  if (!params?.data) return;

  if (params.data.email) {
    params.data.email = params.data.email?.toLowerCase();
  }
};
