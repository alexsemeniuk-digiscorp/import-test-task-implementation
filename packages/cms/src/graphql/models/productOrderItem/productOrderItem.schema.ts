import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'ProductOrderItem'>({
    type: 'ProductOrderItem',
    definition: (t) => {
      t.nullable.float('totalPricePerItem');
      t.nullable.float('totalPrice');
      t.nullable.float('discountAmountPerItem');
      t.nullable.float('taxAmountPerItem');
      t.nullable.float('pointsAmountPerItem');
    },
  }),
];

export const productOrderItemSchema = [...typeSchema];
