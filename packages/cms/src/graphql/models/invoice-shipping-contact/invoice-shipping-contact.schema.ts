import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'InvoiceShippingContact'>({
    type: 'InvoiceShippingContact',
    definition: (t) => {
      t.nullable.string('email');
      t.nullable.string('phoneNumber');
      t.nullable.string('address');
    },
  }),
];

export const invoiceShippingContactSchema = [...typeSchema];
