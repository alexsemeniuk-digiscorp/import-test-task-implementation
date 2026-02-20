import { productsInventoryItemHistoryNumbers } from './resolvers/productsInventoryItemHistoryNumbers';
import { productsInventoryItemPriceRange } from './resolvers/productsInventoryItemPriceRange';
import { productsInventoryItemQuantityRange } from './resolvers/productsInventoryItemQuantityRange';
import { rentalPrice } from './resolvers/rentalPrice';
import { wholesalePrice } from './resolvers/wholesalePrice';
export const ProductInventoryItemQueries = {
  productsInventoryItemPriceRange,
  productsInventoryItemHistoryNumbers,
  productsInventoryItemQuantityRange,
};

export const ProductInventoryItemResolvers = {
  rentalPrice,
  wholesalePrice,
};
