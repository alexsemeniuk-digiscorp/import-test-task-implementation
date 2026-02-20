import { FC, useEffect, useState } from 'react';

import { SelectProps } from 'antd/lib';

import { useResourcesQuery } from '@/graphql';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
  selectedIds?: Maybe<string>[];
}

export const ResourceSelect: FC<Props> = ({
  onChange,
  initValue,
  selectedIds,
  value,
  ...props
}) => {
  const [filters, setFilters] = useState<ResourceFiltersInput>({});

  const { data, refetch, loading } = useResourcesQuery({
    variables: {
      filters: {
        ...filters,
      },
      pagination: {
        limit: 10,
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const resources = data?.resources?.data || [];

  const resourceItems = resources?.map((resource) => ({
    value: resource?.id,
    label: resource?.attributes?.name,
    disabled: selectedIds?.includes(resource?.id),
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
      defaultValue={initValue}
      placeholder={'Select the resource'}
      onChange={onChange}
      options={resourceItems}
      loading={loading}
      onSearch={handleSearch}
      value={value}
      {...props}
    />
  );
};
