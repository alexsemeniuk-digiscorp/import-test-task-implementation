import { FC, useEffect, useState } from 'react';

import { SelectProps } from 'antd/lib';

import { useResourceInventoryItemsQuery } from '@/graphql';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
  selectedIds?: Maybe<string>[];
  locationId?: string | null;
  shouldAppendQuanity?: boolean;
}

export const ResourceLocationSelect: FC<Props> = ({
  onChange,
  initValue,
  selectedIds,
  locationId,
  value,
  shouldAppendQuanity = true,
  ...props
}) => {
  const [filters, setFilters] = useState<ResourceInventoryItemFiltersInput>({});

  const { data, refetch, loading } = useResourceInventoryItemsQuery({
    variables: {
      filters: {
        ...filters,
        ...(locationId
          ? {
              store: {
                id: {
                  eq: locationId,
                },
              },
            }
          : {}),
      },
      pagination: {
        limit: 10,
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [filters, locationId, refetch]);

  const resources = data?.resourceInventoryItems?.data || [];

  const resourceItems = resources?.map((resource) => ({
    value: resource?.id,
    label:
      resource?.attributes?.resource?.data?.attributes?.name +
      (shouldAppendQuanity ? ' - ' + resource?.attributes?.quantity : ''),
    disabled: selectedIds?.includes(resource?.id),
  }));

  const handleSearch = (value: string) => {
    setFilters({
      resource: {
        name: {
          containsi: value,
        },
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
