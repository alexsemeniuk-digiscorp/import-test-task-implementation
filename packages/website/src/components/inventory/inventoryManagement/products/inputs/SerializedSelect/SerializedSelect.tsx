import { useSerializesLazyQuery } from '@/graphql';
import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';
import { isNotEmpty } from '@helpers/types';
import { useCustomSelectLoader } from '@inventory/inventoryManagement/products/hooks/useCustomSelectLoader';
import { useDataSelectMultiple } from '@inventory/inventoryManagement/products/inputs/useDataSelectMultiple';
import { Skeleton } from 'antd';
import { SelectProps } from 'antd/lib';
import { FC, useEffect, useMemo } from 'react';

interface Props extends SelectProps {
  onChange?: (value: string[] | null) => void;
  initialValue?: Maybe<string>[];
  productId?: string;
  returnItemId?: Maybe<string>;
  productOrderId?: string;
}

export const SerializedSelect: FC<Props> = ({
  onChange,
  initialValue,
  productId,
  productOrderId,
  returnItemId,
  ...props
}) => {
  const initialValues = useMemo(
    () => initialValue?.filter(isNotEmpty) || [],
    [initialValue],
  );

  const { handleChange, handleSearch, selectedValue } = useDataSelectMultiple({
    onChange,
    initialSelectedValue: initialValues,
  });

  const [fetch, { data, loading }] = useSerializesLazyQuery({
    variables: {
      filters: {
        or: [
          {
            ...(productId && {
              productInventoryItem: { id: { eq: productId } },
            }),
          },
          {
            ...(productOrderId && {
              sellingProductOrderItem: { id: { eq: productOrderId } },
            }),
          },
          { ...(returnItemId && { returnItem: { id: { eq: returnItemId } } }) },
          {
            id: { in: initialValue },
          },
        ],
      },
      sort: ['createAt:asc'],
    },
  });

  useEffect(() => {
    fetch();
  }, [fetch, productId, productOrderId, returnItemId, initialValue]);

  const loader = useCustomSelectLoader(loading);
  const options = useMemo(() => {
    const types = data?.inventorySerializes?.data || [];

    return types?.map((entity) => ({
      value: entity?.id,
      label: entity?.attributes?.name,
    }));
  }, [data?.inventorySerializes?.data]);

  if (loader) {
    return <Skeleton.Input active={true} size={'default'} block={true} />;
  }

  return (
    <SearchSelect
      allowClear
      defaultValue={initialValue}
      mode={'multiple'}
      placeholder={`Select serial number`}
      onChange={handleChange}
      value={selectedValue}
      options={options}
      loading={loading}
      onSearch={handleSearch}
      dropdownRender={(menu) => <>{menu}</>}
      {...props}
    />
  );
};
