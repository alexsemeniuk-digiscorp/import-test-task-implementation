import { useCallback, useEffect, useState } from 'react';

import { Input } from 'antd';

import { useInvManagementContext } from '@inventory/inventoryManagement/context/useInvManagementContext';

export const SearchEntityInput = () => {
  const { entityName, searchQuery, changeSearchQuery } =
    useInvManagementContext();

  const [value, setValue] = useState<string>('');

  const handleClearValue = useCallback(() => {
    setValue('');
    changeSearchQuery('');
  }, [changeSearchQuery, setValue]);

  useEffect(() => {
    handleClearValue();
  }, [entityName, handleClearValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value) {
        return setValue(value);
      }

      return handleClearValue();
    },
    [handleClearValue],
  );

  const handleSearch = useCallback(() => {
    if (value) {
      return changeSearchQuery(value.trim());
    }
  }, [changeSearchQuery, value]);

  return (
    <Input.Search
      placeholder={'Search'}
      value={value}
      onChange={handleChange}
      onSearch={changeSearchQuery}
      onPressEnter={handleSearch}
      allowClear
    />
  );
};
