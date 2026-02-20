import { idArg, objectType, queryField } from '@nexus/schema';

const querySchema = [
  queryField('servicesPriceRange', {
    type: objectType({
      name: 'ServicesPriceRange',
      definition: (t) => {
        t.float('minPrice');
        t.float('maxPrice');
      },
    }),
    args: {
      id: idArg(),
    },
  }),
];

export const servicePerformerSchema = [...querySchema];
