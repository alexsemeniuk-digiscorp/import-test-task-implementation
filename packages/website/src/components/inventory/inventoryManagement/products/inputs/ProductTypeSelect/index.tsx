import { FC, useEffect, useMemo } from 'react';

import { useProductTypesLazyQuery } from '@/graphql';
import { Skeleton } from 'antd';
import { SelectProps } from 'antd/lib';

import { AddNewSelectButton } from '@ui/form/AddNewSelectButton';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

import { useCustomSelectLoader } from '@inventory/inventoryManagement/products/hooks/useCustomSelectLoader';
import { useProductType } from '@inventory/inventoryManagement/products/inputs/ProductTypeSelect/useProductType';
import { SelectCustomOption } from '@inventory/inventoryManagement/products/inputs/SelectCustomOption';
import { useDataSelect } from '@inventory/inventoryManagement/products/inputs/useDataSelect';

interface Props extends SelectProps {
  onChange?: (value: string | null) => void;
  initialValue?: string;
  editable?: boolean;
}

export const ProductTypeSelect: FC<Props> = ({
  onChange,
  initialValue,
  editable = true,
  ...props
}) => {
  const { handleChange, handleSearch, queryParams, selectedValue } =
    useDataSelect({
      onChange,
      initialSelectedValue: initialValue,
    });
  const { mutationLoading, handleCreate, handleRemove } =
    useProductType(handleChange);

  const [fetch, { data, loading }] = useProductTypesLazyQuery({
    variables: {
      ...queryParams,
      sort: ['createAt:asc'],
      pagination: {
        limit: -1,
      },
    },
  });

  useEffect(() => {
    fetch();
  }, [queryParams, fetch]);

  const loader = useCustomSelectLoader(loading);
  const options = useMemo(() => {
    const types = data?.productTypes?.data || [];

    return types?.map((entity) => ({
      value: entity?.id,
      label: entity?.attributes?.name,
      editable: editable,
    }));
  }, [data?.productTypes?.data, editable]);

  if (loader) {
    return <Skeleton.Input active={true} size={'default'} block={true} />;
  }

  return (
    <SearchSelect
      allowClear
      defaultValue={initialValue}
      placeholder={`Select the type ${editable ? ' or create a new one' : ''}`}
      onChange={handleChange}
      value={selectedValue}
      options={options}
      optionRender={(option) => {
        return <SelectCustomOption {...option} onRemove={handleRemove} />;
      }}
      loading={loading || mutationLoading}
      onSearch={handleSearch}
      dropdownRender={(menu) => (
        <>
          {menu}
          {editable && <AddNewSelectButton handleAddNew={handleCreate} />}
        </>
      )}
      {...props}
    />
  );
};
