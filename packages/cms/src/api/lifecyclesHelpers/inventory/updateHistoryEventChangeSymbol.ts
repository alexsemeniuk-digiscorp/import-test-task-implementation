import { LifecycleHook } from '../types';

import { handleLogger } from '../../../graphql/helpers/errors';

export const updateHistoryEventChangeSymbol: LifecycleHook = async ({
  params,
}) => {
  handleLogger(
    'info',
    'ProductInventoryItemEvent updateHistoryEventChangeSymbol',
    `Params: ${JSON.stringify(params)}`,
  );

  const decreaseOperations = [
    'transfer out',
    'canceled return',
    'sold',
    'adjustment',
    'pos order item add',
    'purchase return',
  ];

  if (params?.data?.change) {
    const { change, eventType } = params.data;

    if (!change.startsWith('+') && !change.startsWith('-')) {
      if (decreaseOperations.includes(eventType)) {
        params.data.change = '-' + change;
      } else {
        params.data.change = '+' + change;
      }
    } else {
      params.data.change;
    }
  } else {
    return;
  }
};
