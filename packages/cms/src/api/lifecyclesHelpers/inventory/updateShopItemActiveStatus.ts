import { LifecycleHook } from '../types';

export const updateShopItemActiveStatus: LifecycleHook = async ({
  params,
  model,
}) => {
  const entityId = params?.where?.id;
  const entityActiveStatus = params?.data?.active;
  const allowNegativeQuantity = params?.data?.isNegativeCount;
  const entityType = model?.singularName;

  if (entityActiveStatus !== undefined || allowNegativeQuantity !== undefined) {
    if (entityType === 'product') {
      const productEntity = await strapi.entityService.findOne(
        'api::product.product',
        entityId,
        {
          fields: ['id'],
          populate: {
            productInventoryItems: {
              fields: ['id'],
            },
          },
        },
      );

      if (
        productEntity?.productInventoryItems &&
        productEntity.productInventoryItems.length > 0
      ) {
        await Promise.all(
          productEntity.productInventoryItems.map((item) =>
            strapi.entityService.update(
              'api::product-inventory-item.product-inventory-item',
              item.id,
              {
                data: {
                  active: entityActiveStatus,
                  isNegativeCount: allowNegativeQuantity,
                },
              },
            ),
          ),
        );
      }
    }

    if (entityType === 'composite-product') {
      const compositeProductEntity = await strapi.entityService.findOne(
        'api::composite-product.composite-product',
        entityId,
        {
          fields: ['id'],
          populate: {
            compositeProductLocationInfos: {
              fields: ['id'],
            },
          },
        },
      );

      if (
        compositeProductEntity?.compositeProductLocationInfos &&
        compositeProductEntity.compositeProductLocationInfos.length > 0
      ) {
        await Promise.all(
          compositeProductEntity.compositeProductLocationInfos.map((item) =>
            strapi.entityService.update(
              'api::composite-product-location-info.composite-product-location-info',
              item.id,
              {
                data: { active: entityActiveStatus },
              },
            ),
          ),
        );
      }
    }

    if (entityType === 'service') {
      const serviceEntity = await strapi.entityService.findOne(
        'api::service.service',
        entityId,
        {
          fields: ['id'],
          populate: {
            serviceLocationInfos: {
              fields: ['id'],
              populate: {
                servicePerformers: {
                  fields: ['id'],
                },
              },
            },
          },
        },
      );

      if (
        serviceEntity?.serviceLocationInfos &&
        serviceEntity.serviceLocationInfos.length > 0
      ) {
        await Promise.all(
          serviceEntity.serviceLocationInfos.map((serviceLocationInfosItem) => {
            if (
              serviceLocationInfosItem?.servicePerformers &&
              serviceLocationInfosItem?.servicePerformers.length > 0
            ) {
              serviceLocationInfosItem?.servicePerformers.map((item) => {
                strapi.entityService.update(
                  'api::service-performer.service-performer',
                  item.id,
                  {
                    data: { active: entityActiveStatus },
                  },
                );
              });
            }
          }),
        );
      }
    }

    if (entityType === 'class') {
      const classEntity = await strapi.entityService.findOne(
        'api::class.class',
        entityId,
        {
          fields: ['id'],
          populate: {
            classLocationInfos: {
              fields: ['id'],
              populate: {
                classPerformers: {
                  fields: ['id'],
                },
              },
            },
          },
        },
      );

      if (
        classEntity?.classLocationInfos &&
        classEntity.classLocationInfos.length > 0
      ) {
        await Promise.all(
          classEntity.classLocationInfos.map((classLocationInfosItem) => {
            if (
              classLocationInfosItem?.classPerformers &&
              classLocationInfosItem?.classPerformers.length > 0
            ) {
              classLocationInfosItem?.classPerformers.map((item) => {
                strapi.entityService.update(
                  'api::class-performer.class-performer',
                  item.id,
                  {
                    data: { active: entityActiveStatus },
                  },
                );
              });
            }
          }),
        );
      }
    }
  }
};
