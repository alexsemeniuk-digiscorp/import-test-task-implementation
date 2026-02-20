import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLeadsSelectQuery } from '@/graphql';
import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';
import { CustomOption } from '@form/inputs/userSelect/UserSelect';

interface Props {
  onChange?: (value: string | string[]) => void;
  mode: 'multiple' | 'tags';
  placeholder?: string;
  defaultValue?: string | string[];
  initFilters?: LeadFiltersInput;
}

export const LeadsSelect: FC<Props> = ({
  onChange,
  mode,
  placeholder,
  defaultValue,
  initFilters = {},
}) => {
  const [filters, setFilters] = useState<LeadFiltersInput>();
  const queryParams = useMemo(
    () => ({
      pagination: {
        limit: 10,
      },
      filters: {
        ...initFilters,
        ...filters,
      },
    }),
    [filters, initFilters],
  );
  const { data, loading, refetch } = useLeadsSelectQuery({
    variables: {
      ...queryParams,
    },
  });

  const handleChange = useCallback(
    (value: string | string[]) => {
      onChange?.(value);
    },
    [onChange],
  );

  useEffect(() => {
    refetch({ ...queryParams });
  }, [filters, data, refetch, queryParams]);

  const leadsData = data?.leads?.data || [];

  const leads = leadsData?.map((lead) => ({
    title: lead?.attributes?.fullName,
    value: lead?.id,
    label: lead?.attributes?.fullName,
  })) as CustomOption[];

  const handleSearch = useCallback(
    (value: string) => {
      setFilters(
        value
          ? {
              or: [
                {
                  fullName: {
                    containsi: value,
                  },
                },
                {
                  email: {
                    containsi: value,
                  },
                },
              ],
            }
          : {},
      );
    },
    [setFilters],
  );

  return (
    <SearchSelect<string | string[], CustomOption>
      placeholder={placeholder ?? 'Select Lead'}
      options={leads}
      optionLabelProp={'title'}
      onChange={handleChange}
      onSearch={handleSearch}
      allowClear
      loading={loading}
      mode={mode}
      defaultValue={defaultValue}
    />
  );
};
