import { LifecycleHook } from '../types';

export const setShopItemActiveStatus: LifecycleHook = async ({
  params,
  model,
}) => {
  // Skip active status set during bulk imports for performance
  if (params?.data?._skipActiveStatusSet) {
    delete params?.data?._skipActiveStatusSet;
    return;
  }

  const entityType = model?.singularName;

  if (!entityType) return;

  let relationEntityId;

  switch (entityType) {
    case 'product-inventory-item':
      relationEntityId = params.data.product;
      break;
    case 'composite-product-location-info':
      relationEntityId = params.data.compositeProduct;
      break;
    case 'service-performer':
      relationEntityId = params.data.serviceLocationInfo;
      break;
    case 'class-performer':
      relationEntityId = params.data.classLocationInfo;
      break;
    default:
      return;
  }

  if (!relationEntityId) return;

  if (entityType === 'product-inventory-item') {
    const productEntity = await strapi.entityService.findOne(
      'api::product.product',
      relationEntityId,
      {
        fields: ['id', 'active', 'isNegativeCount'],
      },
    );

    if (productEntity) {
      params.data.active = productEntity?.active;
      params.data.isNegativeCount = productEntity?.isNegativeCount;
    }
  }

  if (entityType === 'composite-product-location-info') {
    const compositeProductEntity = await strapi.entityService.findOne(
      'api::composite-product.composite-product',
      relationEntityId,
      {
        fields: ['id', 'active'],
      },
    );

    if (compositeProductEntity) {
      params.data.active = compositeProductEntity?.active;
    }
  }

  if (entityType === 'service-performer') {
    const serviceLocationInfoEntity = await strapi.entityService.findOne(
      'api::service-location-info.service-location-info',
      relationEntityId,
      {
        fields: ['id'],
        populate: {
          service: {
            fields: ['id', 'active'],
          },
        },
      },
    );

    if (serviceLocationInfoEntity?.service) {
      params.data.active = serviceLocationInfoEntity?.service?.active;
    }
  }

  if (entityType === 'class-performer') {
    const classLocationInfoEntity = await strapi.entityService.findOne(
      'api::class-location-info.class-location-info',
      relationEntityId,
      {
        fields: ['id'],
        populate: {
          class: {
            fields: ['id', 'active'],
          },
        },
      },
    );

    if (classLocationInfoEntity?.class) {
      params.data.active = classLocationInfoEntity?.class?.active;
    }
  }
};
