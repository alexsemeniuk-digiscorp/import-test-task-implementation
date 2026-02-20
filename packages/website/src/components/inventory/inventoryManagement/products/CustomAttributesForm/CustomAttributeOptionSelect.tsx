import { FC, memo, useCallback, useEffect, useMemo } from 'react';

import { SelectProps } from 'antd/lib';

import {
  useCreateProductAttributeOptionMutation,
  useProductAttributeOptionsQuery,
} from '@/graphql';

import { AddNewSelectButton } from '@ui/form/AddNewSelectButton';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

import { useDataSelect } from '@inventory/inventoryManagement/products/inputs/useDataSelect';

interface Props extends SelectProps {
  onChange?: ((value: string | null) => void) | undefined;
  attributeId?: string | null;
  initialValue?: string;
  editable?: boolean;
}

export const CustomAttributeOptionSelect: FC<Props> = memo(
  ({ onChange, initialValue, attributeId, editable = true }) => {
    const initialFilters = useMemo(() => {
      return attributeId
        ? {
            productAttribute: {
              id: {
                eq: attributeId,
              },
            },
          }
        : undefined;
    }, [attributeId]);

    const { handleChange, handleSearch, queryParams, selectedValue } =
      useDataSelect<ProductAttributeOptionFiltersInput>({
        onChange,
        initialSelectedValue: initialValue,
        initialFilters,
      });

    const { data, refetch, loading } = useProductAttributeOptionsQuery({
      variables: queryParams,
      fetchPolicy: 'network-only',
    });

    useEffect(() => {
      refetch();
    }, [queryParams, refetch]);

    const [createOption, { loading: mutationLoading }] =
      useCreateProductAttributeOptionMutation();

    const options = useMemo(() => {
      const productAttributesOptions =
        data?.productAttributeOptions?.data || [];

      return productAttributesOptions?.map((option) => ({
        value: option?.id,
        label: option?.attributes?.name,
      }));
    }, [data?.productAttributeOptions?.data]);

    const handleCreateNewType = useCallback(
      async (name: string) => {
        await createOption({
          variables: {
            input: {
              name,
              productAttribute: attributeId,
            },
          },
          onCompleted: async (data) => {
            if (data?.createProductAttributeOption?.data?.id) {
              await refetch();
              handleChange(data.createProductAttributeOption.data.id);
            }
          },
        });
      },
      [attributeId, createOption, handleChange, refetch],
    );

    const handleClear = useCallback(() => {
      handleChange('');
    }, [handleChange]);

    return (
      <SearchSelect
        defaultValue={initialValue}
        placeholder={`Select the option ${
          editable ? ' or create a new one' : ''
        }`}
        onChange={handleChange}
        onClear={handleClear}
        value={selectedValue}
        options={options}
        allowClear
        loading={loading || mutationLoading}
        onSearch={handleSearch}
        dropdownRender={(menu) => (
          <>
            {menu}
            {editable && (
              <AddNewSelectButton handleAddNew={handleCreateNewType} />
            )}
          </>
        )}
      />
    );
  },
);
