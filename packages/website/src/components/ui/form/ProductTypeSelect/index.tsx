import { useProductTypesQuery } from '@/graphql';
import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';
import { SelectProps } from 'antd/lib';
import { FC, useState } from 'react';

interface Props extends SelectProps {
  onChange?: (value: string | string[] | null) => void;
}

export const ProductTypeSelect: FC<Props> = ({ onChange, ...props }) => {
  const [filters, setFilters] = useState<ProductTypeFiltersInput>({});

  const { data, loading } = useProductTypesQuery({
    variables: {
      filters: filters,
    },
  });

  const handleSearch = (value: string) => {
    setFilters({
      name: {
        containsi: value,
      },
    });
  };

  const productTypeOptions = data?.productTypes?.data.map((productType) => ({
    value: productType.id,
    label: productType.attributes?.name,
  }));

  return (
    <SearchSelect
      placeholder={'Select the product type'}
      onChange={onChange}
      options={productTypeOptions}
      loading={loading}
      onSearch={handleSearch}
      {...props}
    />
  );
};
