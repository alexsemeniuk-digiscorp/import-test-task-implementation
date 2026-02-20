import { AnyObject } from '@helpers/types';
import { useCallback, useMemo, useState } from 'react';

type Filter = {
  name?: InputMaybe<StringFilterInput>;
};

interface Props<T extends AnyObject = AnyObject> {
  onChange?: (value: string[]) => void;
  initialSelectedValue?: string[];
  initialFilters?: T;
  customSort?: string[];
}

export const useDataSelectMultiple = ({
  onChange,
  initialSelectedValue,
  initialFilters,
  customSort,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<string[] | undefined>(
    initialSelectedValue,
  );

  const handleChange = useCallback(
    (value: string[]) => {
      setSelectedValue(value);

      onChange?.(value);
    },
    [onChange],
  );

  const addValue = useCallback(
    (value: string) => {
      setSelectedValue((prev) => {
        const newValue = [...(prev || []), value];

        onChange?.(newValue);

        return newValue;
      });
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
    [filters, customSort, initialFilters],
  );

  const handleSearch = (value: string) => {
    setFilters({
      name: {
        containsi: value,
      },
    });
  };

  return {
    selectedValue,
    handleChange,
    addValue,
    handleSearch,
    queryParams,
  };
};
