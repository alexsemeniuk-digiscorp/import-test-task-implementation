import { NexusGenEnums } from '../../types/generated/graphql';

type PurchaseType = 'buy' | 'rent';

const SOLD_ORDER_ITEM_FILTER = {
  purchaseType: 'buy' as PurchaseType,
  order: {
    status: {
      $ne: 'draft' as NexusGenEnums['ENUM_ORDER_STATUS'],
    },
  },
};

export const getSoldOrderItemFilterByPeriod = (
  startDate?: Date,
  endDate?: Date,
) => ({
  ...SOLD_ORDER_ITEM_FILTER,
  ...(startDate &&
    endDate && {
      createdAt: {
        $lte: endDate,
        $gte: startDate,
      },
    }),
});
