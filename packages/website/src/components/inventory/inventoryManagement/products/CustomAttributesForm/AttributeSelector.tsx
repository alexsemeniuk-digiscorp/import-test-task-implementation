import { CustomFormItem } from '@form/item/FormItem';
import { CustomAttributeOptionSelect } from '@inventory/inventoryManagement/products/CustomAttributesForm/CustomAttributeOptionSelect';
import { ProductAttributeOptionValues } from '@inventory/inventoryManagement/products/types';
import { Col } from 'antd';
import React from 'react';

type AttributeSelectorProps = {
  selectedAttributes: Maybe<string>[];
  selectedAttributesData: ProductAttributesQuery | undefined;
  initialValues: ProductAttributeOptionValues[] | undefined;
  handleOptionChange: (value?: Maybe<string>) => void;
};

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  selectedAttributes,
  selectedAttributesData,
  initialValues,
  handleOptionChange,
}) => {
  return (
    <>
      {selectedAttributes.map((attrId) => {
        const attributeData =
          selectedAttributesData?.productAttributes?.data?.find(
            ({ id }) => id === attrId,
          );
        const initialValue =
          initialValues?.find(({ attributeId }) => attributeId === attrId)
            ?.optionId ?? undefined;

        return (
          <Col xs={24} lg={12} key={attrId}>
            <CustomFormItem label={attributeData?.attributes?.name}>
              <CustomAttributeOptionSelect
                attributeId={attrId}
                onChange={
                  handleOptionChange(attrId) as
                    | ((value: string | null) => void)
                    | undefined
                }
                initialValue={initialValue}
              />
            </CustomFormItem>
          </Col>
        );
      })}
    </>
  );
};

export default AttributeSelector;
