import { useCallback, useEffect, useMemo, useState } from 'react';

import { AnyObject } from '@helpers/types';

type Filter = {
  name?: InputMaybe<StringFilterInput>;
};

interface Props<T extends AnyObject = AnyObject> {
  onChange?: (value: string) => void;
  initialSelectedValue?: Maybe<string>;
  initialFilters?: T;
  customSort?: string[];
}

export const useDataSelect = <T extends AnyObject = AnyObject>({
  onChange,
  initialSelectedValue,
  initialFilters,
  customSort,
}: Props<T>) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialSelectedValue || null,
  );

  const handleChange = useCallback(
    (value: string) => {
      setSelectedValue(value);

      onChange?.(value);
    },
    [onChange],
  );

  const [filters, setFilters] = useState<Filter>({});

  const queryParams = useMemo(
    () => ({
      filters: {
        ...initialFilters,
        ...filters,
      },
      sort: customSort ? customSort : ['createdAt:desc'],
    }),
    [filters, initialFilters, customSort],
  );

  const handleSearch = (value: string) => {
    setFilters({
      name: {
        containsi: value,
      },
    });
  };

  useEffect(() => {
    if (initialSelectedValue) {
      setSelectedValue(initialSelectedValue);
    }
  }, [initialSelectedValue]);

  return {
    selectedValue,
    handleChange,
    handleSearch,
    queryParams,
  };
};
