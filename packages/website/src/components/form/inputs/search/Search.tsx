import React, { FC, useCallback } from 'react';

import { Input, InputProps } from 'antd';

interface Props extends InputProps {
  onSearch: (value: string) => void;
  loading?: boolean;
}

export const Search: FC<Props> = ({ onSearch, onChange, ...otherProps }) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);

      if (!event.target.value) {
        onSearch('');
      }
    },
    [onSearch, onChange],
  );

  return (
    <Input.Search
      onSearch={onSearch}
      allowClear
      placeholder={'Search'}
      onChange={handleChange}
      {...otherProps}
    />
  );
};
