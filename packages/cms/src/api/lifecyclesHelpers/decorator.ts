import { LifecycleHook } from './types';

import { errors } from '@strapi/utils';
const { ApplicationError } = errors;
export const lifecyclesHookDecorator = (
  callbacks?: LifecycleHook[],
): LifecycleHook => {
  return async (event) => {
    await Promise.all(
      callbacks?.map(async (callback) => {
        try {
          await callback(event);
        } catch (error) {
          const errorMessage = `[Lifecycle Event Error]: event triggered: ${event.action}, ${event.model.singularName} error: ${error}`;
          strapi.log.error(errorMessage);
          throw new ApplicationError(error);
        }
      }) || [],
    );
  };
};
