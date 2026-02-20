import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'CrmAdditionalPhoneNumber'>({
    type: 'CrmAdditionalPhoneNumber',
    definition: (t) => {
      t.nonNull.string('value');
    },
  }),
];

export const crmAdditionalPhoneNumberSchema = [...typeSchema];
