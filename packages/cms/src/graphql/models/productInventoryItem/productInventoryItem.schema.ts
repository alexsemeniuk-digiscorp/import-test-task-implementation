import { extendType, idArg, objectType, queryField } from '@nexus/schema';

const typeSchema = [
  extendType<'ProductInventoryItem'>({
    type: 'ProductInventoryItem',
    definition: (t) => {
      t.nullable.float('wholesalePrice');
      t.nullable.float('rentalPrice');
    },
  }),
];

const querySchema = [
  queryField('productsInventoryItemPriceRange', {
    type: objectType({
      name: 'ProductsInventoryItemPriceRange',
      definition: (t) => {
        t.float('minPrice');
        t.float('maxPrice');
      },
    }),
    args: {
      id: idArg(),
    },
  }),
  queryField('productsInventoryItemQuantityRange', {
    type: objectType({
      name: 'productsInventoryItemQuantityRange',
      definition: (t) => {
        t.float('minQuantity');
        t.float('maxQuantity');
      },
    }),
    args: {
      businessLocationId: idArg(),
    },
  }),
  queryField('productsInventoryItemHistoryNumbers', {
    type: objectType({
      name: 'ProductsInventoryItemHistoryNumbers',
      definition: (t) => {
        t.float('averageCost');
        t.int('owned');
        t.int('memo');
        t.int('laidAway');
        t.int('purchase');
      },
    }),
    args: {
      id: idArg(),
    },
  }),
];

export const productInventoryItemSchema = [...querySchema, ...typeSchema];
