import { useProductInventoryItemAgeRangeQuery } from '@/graphql';
import { get } from 'lodash';

export const useProductInventoryItemAgeRangeData =
  (): ProductInventoryItemAgeRange => {
    const { data } = useProductInventoryItemAgeRangeQuery();
    const minAge = get(data, 'productInventoryItemAgeRange.minAge', 0);
    const maxAge = get(data, 'productInventoryItemAgeRange.maxAge', 0);

    return { minAge, maxAge };
  };
