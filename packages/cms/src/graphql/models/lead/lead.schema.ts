import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'Lead'>({
    type: 'Lead',
    definition: (t) => {
      t.nonNull.string('email');
      t.nullable.string('phoneNumber');
      t.nullable.string('address');
    },
  }),
];

export const leadSchema = [...typeSchema];
