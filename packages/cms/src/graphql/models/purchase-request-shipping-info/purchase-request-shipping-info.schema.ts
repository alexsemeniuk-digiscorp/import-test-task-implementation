import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'PurchaseRequestShippingInfo'>({
    type: 'PurchaseRequestShippingInfo',
    definition: (t) => {
      t.nullable.string('email');
      t.nullable.string('phoneNumber');
      t.nullable.string('address');
    },
  }),
];

export const purchaseRequestShippingInfoSchema = [...typeSchema];
