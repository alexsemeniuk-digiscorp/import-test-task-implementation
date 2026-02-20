import { discountAmountPerItem } from './resolvers/discountAmountPerItem';
import { pointsAmountPerItem } from './resolvers/pointsAmountPerItem';
import { taxAmountPerItem } from './resolvers/taxAmountPerItem';
import { totalPrice } from './resolvers/totalPrice';
import { totalPricePerItem } from './resolvers/totalPricePerItem';

export const ProductOrderItemResolvers = {
  totalPrice,
  totalPricePerItem,
  discountAmountPerItem,
  taxAmountPerItem,
  pointsAmountPerItem,
};
