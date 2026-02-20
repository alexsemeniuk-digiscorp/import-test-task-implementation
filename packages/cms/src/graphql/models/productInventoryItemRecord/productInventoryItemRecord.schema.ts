import { extendType, intArg, objectType, queryField } from '@nexus/schema';

const typeSchema = [
  extendType<'InvtItmRecord'>({
    type: 'InvtItmRecord',
    definition: (t) => {
      t.nullable.float('quantityOnOrder', {
        args: {
          businessLocationId: intArg(),
        },
      });
    },
  }),
];

const querySchema = [
  queryField('productInventoryItemAgeRange', {
    type: objectType({
      name: 'ProductInventoryItemAgeRange',
      definition: (t) => {
        t.float('minAge');
        t.float('maxAge');
      },
    }),
  }),
];

export const productInventoryItemRecordSchema = [...typeSchema, ...querySchema];
