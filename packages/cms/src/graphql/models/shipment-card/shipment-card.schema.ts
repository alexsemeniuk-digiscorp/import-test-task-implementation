import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'ShipmentCard'>({
    type: 'ShipmentCard',
    definition: (t) => {
      t.nullable.string('email');
      t.nullable.string('phoneNumber');
      t.nullable.string('postcode');
      t.nullable.string('streetName');
      t.nullable.string('apartment');
    },
  }),
];

export const shipmentCardSchema = [...typeSchema];
