import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'CrmAdditionalEmail'>({
    type: 'CrmAdditionalEmail',
    definition: (t) => {
      t.nonNull.string('value');
    },
  }),
];

export const crmAdditionalEmailSchema = [...typeSchema];
