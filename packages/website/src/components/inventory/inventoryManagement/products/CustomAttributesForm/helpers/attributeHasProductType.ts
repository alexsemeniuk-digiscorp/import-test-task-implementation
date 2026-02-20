export const attributeHasProductType = (
  productTypeId: Maybe<string>,
  productTypes: Maybe<ProductTypeFragment[]>,
) => {
  if (!productTypeId || !productTypes) {
    return false;
  }

  return productTypes?.some(({ id }) => id === productTypeId);
};
