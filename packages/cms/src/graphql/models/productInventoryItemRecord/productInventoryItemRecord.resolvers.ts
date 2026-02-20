import { productInventoryItemAgeRange } from './resolvers/productInventoryItemAgeRange';
import { quantityOnOrder } from './resolvers/quantityOnOrder';

export const ProductInventoryItemRecordResolvers = {
  quantityOnOrder,
};

export const ProductInventoryItemRecordQueries = {
  productInventoryItemAgeRange,
};
