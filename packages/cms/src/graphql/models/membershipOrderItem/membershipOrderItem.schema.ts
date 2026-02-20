import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'MembershipOrderItem'>({
    type: 'MembershipOrderItem',
    definition: (t) => {
      t.nullable.float('discountAmountPerItem');
      t.nullable.float('taxAmountPerItem');
      t.nullable.float('pointsAmountPerItem');
    },
  }),
];

export const membershipOrderItemSchema = [...typeSchema];
