import { FC, useEffect, useMemo } from 'react';

import { SelectProps } from 'antd/lib';

import { useProductBrandsLazyQuery } from '@/graphql';

import { AddNewSelectButton } from '@ui/form/AddNewSelectButton';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

import { useDataSelect } from '@inventory/inventoryManagement/products/inputs/useDataSelect';

import { useCustomSelectLoader } from '@inventory/inventoryManagement/products/hooks/useCustomSelectLoader';
import { useProductBrand } from '@inventory/inventoryManagement/products/inputs/ProductBrandSelect/useProductBrand';
import { SelectCustomOption } from '@inventory/inventoryManagement/products/inputs/SelectCustomOption';
import { Skeleton } from 'antd';

interface Props extends SelectProps {
  onChange?: (value: string | null) => void;
  initialValue?: string;
  editable?: boolean;
}

export const ProductBrandSelect: FC<Props> = ({
  onChange,
  initialValue,
  editable,
  ...props
}) => {
  const { handleChange, handleSearch, queryParams, selectedValue } =
    useDataSelect({
      onChange,
      initialSelectedValue: initialValue,
    });

  const { mutationLoading, handleCreate, handleRemove } =
    useProductBrand(handleChange);

  const [fetch, { data, loading }] = useProductBrandsLazyQuery({
    variables: {
      ...queryParams,
      sort: ['createAt:asc'],
      pagination: {
        limit: -1,
      },
    },
  });
  const loader = useCustomSelectLoader(loading);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const options = useMemo(() => {
    const brands = data?.productBrands?.data || [];

    return brands?.map((entity) => ({
      value: entity?.id,
      label: entity?.attributes?.name,
      editable: editable,
    }));
  }, [data?.productBrands?.data, editable]);

  if (loader) {
    return <Skeleton.Input active={true} size={'default'} block={true} />;
  }
  return (
    <SearchSelect
      allowClear
      defaultValue={initialValue}
      placeholder={'Select the brand or create new one'}
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
