import { LifecycleHook } from './types';

export const appendCustomCreationDate: LifecycleHook = async ({ params }) => {
  params.data.customCreationDate =
    params.data.customCreationDate || new Date().toISOString();
};
