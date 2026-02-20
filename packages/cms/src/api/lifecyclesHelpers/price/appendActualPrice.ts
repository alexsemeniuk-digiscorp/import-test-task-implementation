import { LifecycleHook } from '../types';

export const appendActualPrice: LifecycleHook = async ({
  result,
  params,
  model,
}) => {
  // Skip append actual price during bulk imports for performance
  if (params?.data?._skipAppendActualPrice) {
    delete params?.data?._skipAppendActualPrice;
    return;
  }

  const id = result?.id;
  const apiName = model.uid as any;

  if (params?.data?.price && params.data.price > 0) return;

  const productServices = await strapi.service(apiName);
  const actualPrice = await productServices.getActualPrice(id);

  await strapi.entityService.update(apiName, id, {
    data: {
      price: actualPrice,
    },
  });
};
