import encryptionService from 'strapi-plugin-encryptable-field/server/services/service';
import { LifecycleHook } from '../types';

export const modifyClearentApiKeyLifecycleHook: LifecycleHook = async ({
  params,
}) => {
  params.data.hppKey = encryptionService({ strapi }).encrypt(
    params.data.hppKey,
  );
};
