import { SelectProps } from 'antd/lib';
import { FC, useEffect, useMemo } from 'react';

import { useSerializesWithoutProductLazyQuery } from '@/graphql';
import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';
import { isNotEmpty } from '@helpers/types';
import { useCustomSelectLoader } from '@inventory/inventoryManagement/products/hooks/useCustomSelectLoader';
import { SelectCustomOption } from '@inventory/inventoryManagement/products/inputs/SelectCustomOption';
import { useSerializedData } from '@inventory/inventoryManagement/products/inputs/SerializedSelect/useSerializedData';
import { useDataSelectMultiple } from '@inventory/inventoryManagement/products/inputs/useDataSelectMultiple';
import { AddNewSelectButton } from '@ui/form/AddNewSelectButton';
import { Skeleton } from 'antd';

interface Props extends SelectProps {
  onChange?: (value: string[] | null) => void;
  initialValue?: string[];
  editable?: boolean;
}

export const SerializedWithoutProductSelect: FC<Props> = ({
  onChange,
  initialValue,
  editable = true,
  ...props
}) => {
  const initialValues = useMemo(
    () => initialValue?.filter(isNotEmpty) || [],
    [initialValue],
  );

  const { handleChange, handleSearch, queryParams, selectedValue } =
    useDataSelectMultiple({
      onChange,
      initialSelectedValue: initialValues,
    });
  const { mutationLoading, handleCreate, handleRemove } = useSerializedData();

  const [fetch, { data, loading }] = useSerializesWithoutProductLazyQuery({
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
    const types = data?.inventorySerializes?.data || [];

    return types?.map((entity) => ({
      value: entity?.id,
      label: entity?.attributes?.name,
      editable: editable,
    }));
  }, [data?.inventorySerializes?.data, editable]);

  if (loader) {
    return <Skeleton.Input active={true} size={'default'} block={true} />;
  }

  return (
    <SearchSelect
      allowClear
      defaultValue={initialValue}
      placeholder={`Select serial number ${
        editable ? ' or create a new one' : ''
      }`}
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
