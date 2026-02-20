import { generateUUID } from '../../utils/randomBytes';
import { LifecycleHook } from './types';

export const appendUuid: LifecycleHook = async ({ params }) => {
  params.data.uuid = params.data.uuid || generateUUID();
};
