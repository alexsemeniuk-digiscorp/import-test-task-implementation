import { FC, useCallback, useEffect, useMemo } from 'react';

import { Flex } from 'antd';
import { SelectProps } from 'antd/lib';

import {
  useCreateProductAttributeMutation,
  useProductAttributesQuery,
  useUpdateProductAttributeMutation,
} from '@/graphql';

import { isNotEmpty } from '@helpers/types';

import { useStatusMessage } from '@app/StatusMessageContext/statusMessageContext';

import { AddNewSelectButton } from '@ui/form/AddNewSelectButton';

import { SearchSelect } from '@form/inputs/searchSelect/SearchSelect';

import { ChangeRelatedProductTypeButton } from '@inventory/inventoryManagement/products/CustomAttributesForm/ChangeRelatedProductTypeButton';
import { attributeHasProductType } from '@inventory/inventoryManagement/products/CustomAttributesForm/helpers/attributeHasProductType';
import { useDataSelectMultiple } from '@inventory/inventoryManagement/products/inputs/useDataSelectMultiple';

interface Props extends SelectProps {
  onChange?: (value: Maybe<string>[]) => void;
  productType?: Maybe<string>;
  initialValues?: Maybe<string>[];
}

export const CustomAttributesSelect: FC<Props> = ({
  onChange,
  productType,
  initialValues,
}) => {
  const initialValuesIds = useMemo(() => {
    return initialValues?.filter(isNotEmpty) || [];
  }, [initialValues]);

  const { handleChange, handleSearch, queryParams, selectedValue, addValue } =
    useDataSelectMultiple({
      onChange,
      initialSelectedValue: initialValuesIds,
    });

  const { data, refetch, loading } = useProductAttributesQuery({
    variables: queryParams,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch();
  }, [queryParams, refetch]);

  const message = useStatusMessage();

  const [updateAttribute, { loading: updateLoading }] =
    useUpdateProductAttributeMutation({
      onCompleted: async (data) => {
        if (data?.updateProductAttribute?.data?.id) {
          await refetch();

          message.open('success', 'Attribute updated successfully');
        } else {
          message.open('error');
        }
      },
    });

  const handleUpdateProductType = useCallback(
    (type: 'add' | 'remove', id: Maybe<string>) => {
      if (!productType || !id) {
        return;
      }

      const attribute = data?.productAttributes?.data?.find(
        ({ id: attributeId }) => attributeId === id,
      );

      const productTypes =
        attribute?.attributes?.productTypes?.data?.map(({ id }) => id) || [];

      return updateAttribute({
        variables: {
          id,
          input: {
            productTypes:
              type === 'add'
                ? [...productTypes, productType]
                : [...productTypes.filter((typeId) => typeId !== productType)],
          },
        },
      });
    },
    [data?.productAttributes?.data, productType, updateAttribute],
  );

  const options = useMemo(() => {
    const productAttributes = data?.productAttributes?.data || [];

    const sortedByRelatedTypeAttributes = productType
      ? [...productAttributes]?.sort((a) => {
          const hasCurrentType = attributeHasProductType(
            productType,
            a?.attributes?.productTypes?.data,
          );

          return hasCurrentType ? -1 : 1;
        })
      : productAttributes;

    return sortedByRelatedTypeAttributes?.map((attribute) => {
      const hasCurrentType = attributeHasProductType(
        productType,
        attribute?.attributes?.productTypes?.data,
      );

      return {
        value: attribute?.id,
        label: (
          <Flex
            justify={'space-between'}
            align={'center'}
            style={{ marginRight: 8 }}
          >
            {attribute?.attributes?.name}
            {productType && (
              <ChangeRelatedProductTypeButton
                hasCurrentType={hasCurrentType}
                id={attribute?.id}
                handleUpdateProductType={handleUpdateProductType}
              />
            )}
          </Flex>
        ),
        title: attribute?.attributes?.name,
      };
    });
  }, [handleUpdateProductType, data?.productAttributes?.data, productType]);

  const [createAttribute, { loading: createLoading }] =
    useCreateProductAttributeMutation({
      onCompleted: async (data) => {
        if (data?.createProductAttribute?.data?.id) {
          await refetch();

          addValue(data.createProductAttribute.data.id);

          message.open('success', 'Attribute created successfully');
        } else {
          message.open('error');
        }
      },
    });

  const createNewType = useCallback(
    async (name: string) => {
      await createAttribute({
        variables: {
          input: {
            name,
            productTypes: [productType],
          },
        },
        onCompleted: async (data) => {
          if (data?.createProductAttribute?.data?.id) {
            await refetch();

            addValue(data.createProductAttribute.data.id);
          }
        },
      });
    },
    [createAttribute, productType, refetch, addValue],
  );

  return (
    <SearchSelect
      placeholder={'Select the attributes or create new ones'}
      onChange={handleChange}
      value={selectedValue}
      options={options}
      optionLabelProp={'title'}
      loading={loading || createLoading || updateLoading}
      onSearch={handleSearch}
      dropdownRender={(menu) => (
        <>
          {menu}
          <AddNewSelectButton handleAddNew={createNewType} />
        </>
      )}
      mode={'multiple'}
    />
  );
};
