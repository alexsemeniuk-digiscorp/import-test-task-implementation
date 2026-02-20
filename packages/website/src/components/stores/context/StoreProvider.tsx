import {
  FC,
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useSessionStorage } from 'usehooks-ts';

import { useBusinessLocationsDropdownLazyQuery } from '@/graphql';
import { StoreContext } from '@components/stores/context/StoreContext';
import { get } from 'lodash';

export const StoreProvider: FC<PropsWithChildren> = memo(({ children }) => {
  const [hasAllStoresOption, setHasAllStoresOption] = useState(true);

  const [selectedStoreId, setSelectedStoreId] = useSessionStorage<
    string | null
  >('selectedStoreId', null);

  const [filters, setFilters] = useState<BusinessLocationFiltersInput>({});

  const [fetch, { data, loading, refetch }] =
    useBusinessLocationsDropdownLazyQuery({
      variables: {
        filters: {
          ...filters,
          type: { eq: 'store' },
          archived: { eq: false },
        },
        sort: ['createdAt:asc'],
      },
    });

  const handleSearch = useCallback((value: string) => {
    setFilters({
      type: { eq: 'store' },
      archived: { eq: false },
      or: [
        {
          name: {
            containsi: value,
          },
        },
        {
          location: {
            address: {
              containsi: value,
            },
          },
        },
        {
          phoneNumber: {
            contains: value,
          },
        },
        {
          email: {
            containsi: value,
          },
        },
      ],
    });
  }, []);
  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      refetch({ filters });
    }
  }, [filters, refetch]);

  const handleChange = useCallback(
    (id: string) => {
      setSelectedStoreId(id === 'all' ? null : id);
    },
    [setSelectedStoreId],
  );

  const handleSetAllStoresOption = useCallback((value: boolean) => {
    setHasAllStoresOption(value);
  }, []);

  const stores = get(
    data,
    'businessLocations.data',
    [] as BusinessLocationDropdownFragment[],
  );

  return (
    <StoreContext.Provider
      value={{
        selectedStoreId,
        handleChange,
        handleSearch,
        allStores: stores,
        loading,
        hasAllStoresOption,
        toggleAllStoresOption: handleSetAllStoresOption,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
});
