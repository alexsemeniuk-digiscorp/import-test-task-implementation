import { LifecycleHook } from '../types';

export const transactionStatusCheck: LifecycleHook = async ({ params }) => {
  const data = params?.data;
  if (!data) return;

  const { status, summary, paid } = data;

  if (status === 'Open' && summary <= paid) {
    data.status = 'Paid';
  } else if (status === 'Paid' && summary > paid) {
    data.status = 'Open';
  } else {
    return;
  }
};
