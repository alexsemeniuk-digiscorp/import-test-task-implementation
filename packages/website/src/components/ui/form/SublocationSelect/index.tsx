import { useSubLocationsSelectQuery } from '@/graphql';
import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';
import { SelectProps } from 'antd/lib';
import { FC, useEffect, useState } from 'react';

interface Props extends SelectProps {
  onChange?: (value?: string) => void;
  selectedStore: string;
  selectedIds?: Maybe<string>[];
}

export const SublocationSelect: FC<Props> = ({
  onChange,
  selectedStore,
  selectedIds,
  ...props
}) => {
  const [filters, setFilters] = useState<BusinessLocationFiltersInput>({});

  const { data, refetch, loading } = useSubLocationsSelectQuery({
    variables: {
      filters: {
        ...filters,
        businessLocation: {
          id: {
            eq: selectedStore,
          },
        },
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [selectedStore, filters, refetch]);

  const handleSearch = (value: string) => {
    setFilters({
      name: {
        containsi: value,
      },
    });
  };

  const sublocationItems = data?.sublocations?.data.map((sublocation) => ({
    value: sublocation.id,
    label: sublocation.attributes?.name,
    disabled: selectedIds?.includes(sublocation.id),
  }));

  return (
    <SearchSelect
      placeholder={'Select the sublocation'}
      onChange={onChange}
      options={sublocationItems}
      loading={loading}
      onSearch={handleSearch}
      {...props}
    />
  );
};
