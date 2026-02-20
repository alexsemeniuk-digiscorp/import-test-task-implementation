import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'ServiceOrderItem'>({
    type: 'ServiceOrderItem',
    definition: (t) => {
      t.nullable.float('discountAmountPerItem');
      t.nullable.float('taxAmountPerItem');
      t.nullable.float('pointsAmountPerItem');
    },
  }),
];

export const serviceOrderItemSchema = [...typeSchema];
