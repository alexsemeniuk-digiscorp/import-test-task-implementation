import { FC, useEffect, useMemo, useState } from 'react';

import { Col, Form, Row } from 'antd';

import { useProductAttributesLazyQuery } from '@/graphql';

import { CustomFormItem } from '@form/item/FormItem';

import AttributeSelector from '@inventory/inventoryManagement/products/CustomAttributesForm/AttributeSelector';
import { CustomAttributesSelect } from '@inventory/inventoryManagement/products/CustomAttributesForm/CustomAttributesSelect';
import {
  ProductAttributeOptionValues,
  ProductValues,
} from '@inventory/inventoryManagement/products/types';

interface Props {
  onChange: (values?: ProductAttributeOptionValues[]) => void;
  initialValues?: ProductAttributeOptionValues[];
}

export const CustomAttributesForm: FC<Props> = ({
  onChange,
  initialValues,
}) => {
  const form = Form.useFormInstance<ProductValues>();

  const productType = Form.useWatch('productType', form);

  const [loadTypeAttributes, { data }] = useProductAttributesLazyQuery();

  useEffect(() => {
    if (productType) {
      loadTypeAttributes({
        variables: {
          filters: {
            productTypes: {
              id: {
                eq: productType,
              },
            },
          },
        },
      });
    }
  }, [loadTypeAttributes, productType]);

  const typeAttributeIds = useMemo(() => {
    return data?.productAttributes?.data?.map(({ id }) => id);
  }, [data?.productAttributes?.data]);

  const initialAttributesIds = useMemo(() => {
    return initialValues?.map(({ attributeId }) => attributeId);
  }, [initialValues]);

  const defaultAttributesIds = useMemo(() => {
    return [
      ...new Set([
        ...(initialAttributesIds || []),
        ...(typeAttributeIds || []),
      ]),
    ];
  }, [initialAttributesIds, typeAttributeIds]);

  const [selectedAttributes, setSelectedAttributes] = useState<Maybe<string>[]>(
    defaultAttributesIds || [],
  );

  const [loadSelectedAttributes, { data: selectedAttributesData }] =
    useProductAttributesLazyQuery();

  const [selectedOptions, setSelectedOptions] = useState<
    ProductAttributeOptionValues[]
  >(initialValues || []);

  useEffect(() => {
    if (selectedAttributes.length) {
      loadSelectedAttributes({
        variables: {
          filters: {
            id: {
              in: selectedAttributes,
            },
          },
        },
      });
    }
    const filteredOptionData = selectedOptions?.filter((item) =>
      selectedAttributes.includes(item.attributeId),
    );
    setSelectedOptions(filteredOptionData);
    // eslint-disable-next-line
  }, [loadSelectedAttributes, selectedAttributes]);

  const handleOptionChange =
    (attributeId: Maybe<string>) => (value?: Maybe<string>) => {
      setSelectedOptions((previousOptions) => {
        if (value) {
          const previousValue = previousOptions.find(
            (option) => option?.attributeId === attributeId,
          );

          if (previousValue) {
            return previousOptions.map((option) => {
              if (option?.attributeId === attributeId) {
                return {
                  ...option,
                  optionId: value,
                };
              }

              return option;
            });
          }

          return [
            ...previousOptions,
            {
              attributeId: attributeId,
              optionId: value,
            },
          ];
        }

        return previousOptions.filter(
          (option) => option.attributeId !== attributeId,
        );
      });
    };

  useEffect(() => {
    onChange(selectedOptions);
  }, [onChange, selectedOptions]);

  return (
    <Row align={'top'} justify={'start'} gutter={24}>
      <Col xs={24} lg={16}>
        <Row gutter={24}>
          <Col xs={24} lg={18} xl={12}>
            <CustomFormItem
              label={'Attributes'}
              tooltip={
                'Attributes that are default for selected product type are applied automatically'
              }
            >
              <CustomAttributesSelect
                productType={productType}
                initialValues={defaultAttributesIds}
                onChange={setSelectedAttributes}
              />
            </CustomFormItem>
          </Col>
          <AttributeSelector
            selectedAttributes={selectedAttributes}
            selectedAttributesData={selectedAttributesData}
            initialValues={initialValues}
            handleOptionChange={handleOptionChange}
          />
        </Row>
      </Col>
    </Row>
  );
};
