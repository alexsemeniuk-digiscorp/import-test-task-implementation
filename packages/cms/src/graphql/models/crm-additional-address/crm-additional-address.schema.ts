import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'CrmAdditionalAddress'>({
    type: 'CrmAdditionalAddress',
    definition: (t) => {
      t.nonNull.string('value');
    },
  }),
];

export const crmAdditionalAddressSchema = [...typeSchema];
