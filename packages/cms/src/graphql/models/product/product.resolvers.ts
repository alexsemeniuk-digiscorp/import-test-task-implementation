import { createProductsBasedOnAIGeneration } from './resolvers/createProductsBasedOnAIGeneration';
import { createProductsFromCSV } from './resolvers/createProductsFromCSV';
import { fastUpdateAllProductsFromCSV } from './resolvers/fastUpdateAllProductsFromCSV';
import { fastUpdateSingleProduct } from './resolvers/fastUpdateSingleProduct';
import { grossMargin } from './resolvers/grossMargin';
import { numberLocationsPresented } from './resolvers/numberLocationsPresented';
import { prevProductSyncWithAccountingService } from './resolvers/prevProductSyncWithAccountingService';
import { productInventoryItemId } from './resolvers/productInventoryItemId';
import { productsPriceRange } from './resolvers/productsPriceRange';
import { quantity } from './resolvers/quantity';
import { quantityOnOrder } from './resolvers/quantityOnOrder';
import { quantitySoldLastWeek } from './resolvers/quantitySoldLastWeek';
import { shopifyCollections } from './resolvers/shopifyCollections';
import { soldRevenue } from './resolvers/soldRevenue';
import { tax } from './resolvers/tax';
import { totalQuantitySold } from './resolvers/totalQuantitySold';
import { updateDefaultPriceFromCSV } from './resolvers/updateDefaultPriceFromCSV';
import { updateProductTypesItemCategories } from './resolvers/updateProductTypesItemCategories';

export const ProductResolvers = {
  quantity,
  totalQuantitySold,
  quantitySoldLastWeek,
  soldRevenue,
  numberLocationsPresented,
  grossMargin,
  tax,
  productInventoryItemId,
  quantityOnOrder,
};

export const ProductQueries = {
  productsPriceRange,
};

export const ProductMutations = {
  createProductsFromCSV,
  createProductsBasedOnAIGeneration,
  shopifyCollections,
  fastUpdateSingleProduct,
  fastUpdateAllProductsFromCSV,
  prevProductSyncWithAccountingService,
  updateDefaultPriceFromCSV,
  updateProductTypesItemCategories,
};
