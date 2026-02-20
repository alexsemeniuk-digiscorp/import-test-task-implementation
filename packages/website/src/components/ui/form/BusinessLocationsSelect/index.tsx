import { FC, useEffect, useState } from 'react';

import { SelectProps } from 'antd/lib';

import { useBusinessLocationsSelectQuery } from '@/graphql';

import { useActiveStoresQuery } from '@components/stores/hooks/useActiveStoresQuery';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  selectedIds?: Maybe<string>[];
  storesOnly?: boolean;
}

const locationQueriesMap = {
  ['stores']: useActiveStoresQuery,
  ['all']: useBusinessLocationsSelectQuery,
};

export const BusinessLocationsSelect: FC<Props> = ({
  onChange,
  selectedIds,
  storesOnly = true,
  ...props
}) => {
  const [filters, setFilters] = useState<BusinessLocationFiltersInput>({});

  const { data, refetch, loading } = locationQueriesMap[
    storesOnly ? 'stores' : 'all'
  ]({
    variables: {
      filters: {
        ...filters,
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const stores = data?.businessLocations?.data || [];

  const storeItems = stores?.map((store) => ({
    value: store?.id,
    label: store?.attributes?.name,
    disabled: selectedIds?.includes(store.id),
  }));

  const handleSearch = (value: string) => {
    setFilters({
      name: {
        containsi: value,
      },
    });
  };

  return (
    <SearchSelect
      placeholder={'Select the store'}
      onChange={onChange}
      options={storeItems}
      loading={loading}
      onSearch={handleSearch}
      {...props}
    />
  );
};
