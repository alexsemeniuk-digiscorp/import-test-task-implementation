export const createWeightEntry = async ({
  weight,
  weightUnit,
  productId,
  parsedProduct,
}) => {
  if (weight && weightUnit) {
    const newWeight = await strapi.entityService.create('api::weight.weight', {
      data: {
        value: weight,
        unit: weightUnit,
        product: productId,
      },
    });

    parsedProduct.weight = newWeight?.value;
    parsedProduct.weightUnit = newWeight?.unit;
  }
};

export const createDimensionEntry = async ({
  dimensionLength,
  dimensionWidth,
  dimensionHeight,
  dimensionUnit,
  productId,
  parsedProduct,
}) => {
  if (dimensionLength && dimensionWidth && dimensionHeight && dimensionUnit) {
    const newDimension = await strapi.entityService.create(
      'api::dimension.dimension',
      {
        data: {
          length: dimensionLength,
          width: dimensionWidth,
          height: dimensionHeight,
          unit: dimensionUnit,
          product: productId,
        },
      },
    );

    parsedProduct.dimensionLength = newDimension?.length;
    parsedProduct.dimensionWidth = newDimension?.width;
    parsedProduct.dimensionHeight = newDimension?.height;
    parsedProduct.dimensionUnit = newDimension?.unit;
  }
};
