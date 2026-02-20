export const getNewestProductAttributeOptionIds = (product) => {
  const latestOptions = {};

  product.productAttributeOptions.forEach((option) => {
    const attributeId = option.productAttribute.id;

    if (
      !latestOptions[attributeId] ||
      new Date(option.createdAt) >
        new Date(latestOptions[attributeId].createdAt)
    ) {
      latestOptions[attributeId] = option;
    }
  });

  return Object.values(latestOptions).map(
    (option) => (option as { id: string }).id,
  );
};
