import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'Tenant'>({
    type: 'Tenant',
    definition: (t) => {
      t.nullable.string('email');
      t.nullable.string('phoneNumber');
    },
  }),
];

export const tenantSchema = [...typeSchema];
