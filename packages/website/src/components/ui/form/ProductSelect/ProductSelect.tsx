import { FC, useEffect, useMemo, useState } from 'react';

import { Flex } from 'antd';
import { SelectProps } from 'antd/lib';

import { useProductsSelectLazyQuery, useProductsSelectQuery } from '@/graphql';

import { formatToCurrency } from '@helpers/formatter';

import AvatarInfo from '@ui/avatar/AvatarInfo';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

export const buildProductInfo = (product: ProductSelectFragment) => {
  const availableIn = product?.attributes?.productInventoryItems?.data
    .map((item) => item?.attributes?.businessLocation?.data?.attributes?.name)
    .join(', ');

  return (
    <Flex vertical gap={4}>
      <div>Available in: {availableIn}</div>
      <div>
        Default Price: {formatToCurrency(product?.attributes?.defaultPrice)}
      </div>
    </Flex>
  );
};
interface Props extends SelectProps {
  onChange?: (value: string) => void;
  initValue?: string;
  selectedIds?: Maybe<string>[];
}

export const ProductSelect: FC<Props> = ({
  onChange,
  initValue,
  value,
  selectedIds,
  ...props
}) => {
  const [filters, setFilters] = useState<ProductFiltersInput>({});
  const [searchText, setSearchText] = useState('');

  const {
    data: selectData,
    refetch,
    loading: selectDataLoading,
  } = useProductsSelectQuery({
    variables: {
      filters: {
        ...filters,
      },
    },
  });

  const [
    fetchInitProducts,
    { data: initialSelectData, loading: initialSelectDataLoading },
  ] = useProductsSelectLazyQuery({
    fetchPolicy: 'network-only',
  });

  const initialId = value || initValue;
  const loading = selectDataLoading || initialSelectDataLoading;

  useEffect(() => {
    if (initialId) {
      fetchInitProducts({
        variables: {
          filters: {
            id: { eq: initialId },
          },
        },
      });
    }
  }, [initialId, fetchInitProducts]);

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  const products = useMemo(() => {
    const selectList = selectData?.products?.data ?? [];
    const initialSelectList =
      searchText.trim() === '' ? initialSelectData?.products?.data ?? [] : [];

    const selectListWithoutInitialValue =
      searchText.trim() === ''
        ? selectList.filter((item) => item.id !== initialId)
        : selectList;

    return [...initialSelectList, ...selectListWithoutInitialValue];
  }, [selectData, initialSelectData, initialId, searchText]);

  const productItems = products?.map((product) => ({
    value: product?.id,
    label: (
      <AvatarInfo
        src={product?.attributes?.files?.data?.[0]?.attributes?.url}
        title={product?.attributes?.name}
        description={buildProductInfo(product)}
        isProduct
      />
    ),
    title: product?.attributes?.name,
    disabled: selectedIds?.includes(product?.id),
  }));

  const handleSearch = (value: string) => {
    setSearchText(value);
    setFilters({
      or: [
        {
          name: {
            containsi: value,
          },
        },
        {
          SKU: {
            containsi: value,
          },
        },
        {
          barcode: {
            containsi: value,
          },
        },
        {
          model: {
            containsi: value,
          },
        },
        {
          MPN: {
            containsi: value,
          },
        },
      ],
    });
  };

  return (
    <SearchSelect
      defaultValue={initValue}
      placeholder={props.placeholder || 'Select the product'}
      onChange={onChange}
      options={productItems}
      loading={loading}
      onSearch={handleSearch}
      value={value}
      optionLabelProp={'title'}
      {...props}
    />
  );
};
