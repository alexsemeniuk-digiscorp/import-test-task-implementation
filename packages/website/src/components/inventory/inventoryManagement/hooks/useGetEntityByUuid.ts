import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';

import {
  useJewelryProductByUuidLazyQuery,
  useProductByUuidLazyQuery,
  useProductGroupByUuidLazyQuery,
  useResourceByUuidLazyQuery,
} from '@/graphql';

import { useNavigateToNotFound } from '@hooks/routing/useNavigateToNotFound';

type PossibleEntities =
  | 'products'
  | 'jewelryProducts'
  | 'productGroups'
  | 'resources';

type QueryType = {
  products: ProductByUuidQuery;
  jewelryProducts: JewelryProductByUuidQuery;
  productGroups: ProductGroupByUuidQuery;
  resources: ResourceByUuidQuery;
};

type ReturnType<T extends PossibleEntities> = {
  loading: boolean;
  data: QueryType[T] | undefined;
  handleTriggerRefetch: () => Promise<void>;
};
export const useGetEntityByUuid = <T extends PossibleEntities>(
  dataType: T,
  propsUuid?: string,
): ReturnType<T> => {
  const params = useParams<{ uuid: string }>();

  const uuid = params?.uuid ?? propsUuid;

  const navigateToNotFound = useNavigateToNotFound();

  const uuidQuery = useMemo(
    () =>
      ({
        products: useProductByUuidLazyQuery,
        jewelryProducts: useJewelryProductByUuidLazyQuery,
        productGroups: useProductGroupByUuidLazyQuery,
        resources: useResourceByUuidLazyQuery,
      })[dataType],
    [dataType],
  );

  const [getEntity, { data, loading, refetch }] = uuidQuery();

  useEffect(() => {
    if (!uuid) {
      navigateToNotFound();

      return;
    }

    getEntity({
      variables: {
        uuid,
      },
    });
  }, [uuid, getEntity, navigateToNotFound]);

  const handleTriggerRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    loading,
    data,
    handleTriggerRefetch,
  };
};
