import { LifecycleHook } from '../types';
import { handleLogger } from './../../../graphql/helpers/errors';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const cleanPhoneNumber: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  handleLogger(
    'info',
    'CONTACT cleanPhoneNumber',
    `Params :: ${JSON.stringify(params)}`,
  );
  if (!params?.data) return;

  const cleanNumber = (number: string) => number.replace(/[^+\d]/g, '');

  if (params.data.phoneNumber) {
    params.data.phoneNumber = cleanNumber(params.data.phoneNumber);
  } else if (params.data.value) {
    params.data.value = cleanNumber(params.data.value);
  }
};
