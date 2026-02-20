import { ProductAttributeOptionValues } from '@inventory/inventoryManagement/products/types';

export const updateSelectedOptions = (
  options: ProductAttributeOptionValues[],
  attributeId: Maybe<string>,
  value?: Maybe<string>,
): ProductAttributeOptionValues[] => {
  if (value) {
    const existingOption = options.find(
      (option) => option?.attributeId === attributeId,
    );

    if (existingOption) {
      return options.map((option) =>
        option?.attributeId === attributeId
          ? { ...option, optionId: value }
          : option,
      );
    }
    return [...options, { attributeId, optionId: value }];
  }
  return options.filter((option) => option.attributeId !== attributeId);
};
