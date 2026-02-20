import { ReactNode, useMemo } from 'react';

import { Select } from 'antd';
import { SelectProps } from 'antd/lib';

import { debounce } from 'lodash';

type ValueType = string | string[];

interface CustomOption {
  value?: Maybe<string | number>;
  label?: ReactNode;
}

export const SearchSelect = <
  V = ValueType,
  O extends CustomOption = CustomOption,
>({
  onSearch,
  ...restProps
}: SelectProps<V, O>) => {
  const debouncedHandleSearch = useMemo(() => {
    if (!onSearch) {
      return;
    }

    return debounce(onSearch, 500);
  }, [onSearch]);
  return (
    <Select<V, O>
      autoClearSearchValue
      onSearch={debouncedHandleSearch}
      showSearch
      filterOption={false}
      {...restProps}
    />
  );
};
