import { discountAmountPerItem } from './resolvers/discountAmountPerItem';
import { pointsAmountPerItem } from './resolvers/pointsAmountPerItem';
import { taxAmountPerItem } from './resolvers/taxAmountPerItem';

export const MembershipOrderItemResolvers = {
  discountAmountPerItem,
  taxAmountPerItem,
  pointsAmountPerItem,
};
