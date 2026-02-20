import { objectType, queryField } from '@nexus/schema';

const querySchema = [
  queryField('totalFileItemsSize', {
    type: objectType({
      name: 'TotalFileItemsSizeType',
      definition: (t) => {
        t.float('totalSize');
      },
    }),
  }),
];

export const fileItemSchema = [...querySchema];
