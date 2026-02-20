import { extendType } from '@nexus/schema';

const typeSchema = [
  extendType<'Form'>({
    type: 'Form',
    definition: (t) => {
      t.nullable.string('sendTo');
    },
  }),
];

export const formSchema = [...typeSchema];
