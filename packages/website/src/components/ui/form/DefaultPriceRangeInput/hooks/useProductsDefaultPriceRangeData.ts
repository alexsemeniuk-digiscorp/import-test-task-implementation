import { useProductsPriceRangeQuery } from '@/graphql';

export const useProductsDefaultPriceRangeData =
  (): InventoryAuditItemRangeData => {
    const { data } = useProductsPriceRangeQuery();

    return {
      minPrice: data?.productsPriceRange?.minPrice ?? 0,
      maxPrice: data?.productsPriceRange?.maxPrice ?? 0,
    };
  };
