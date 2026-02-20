import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { concat, difference } from 'lodash';
import { LifecycleHook } from '../../types';

import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const deleteOrderItemOnReturnItemCreate: LifecycleHook = async ({
  params,
}: BeforeLifecycleEvent) => {
  const { productOrderItem, quantityReturned, serializes } = params.data;
  const productOrderItemId = productOrderItem;

  const productOrderItemEntity = await strapi.entityService.findOne(
    'api::product-order-item.product-order-item',
    productOrderItemId,
    {
      fields: ['id', 'quantity'],
      populate: {
        serializes: {
          fields: ['id'],
        },
        order: {
          fields: ['id', 'memo'],
        },
        product: {
          fields: ['id'],
          populate: {
            serializes: {
              fields: ['id'],
            },
          },
        },
      },
    },
  );

  const actualSerialNumbersInOrder = productOrderItemEntity?.serializes?.map(
    (item) => String(item.id),
  );
  const actualSerialNumbersInProductInventoryItem =
    productOrderItemEntity?.product?.serializes?.map((item) => String(item.id));

  const newSerialNumbersForOrder = difference(
    actualSerialNumbersInOrder,
    serializes,
  ) as ID[];

  const isMemoOrder = !!productOrderItemEntity?.order?.memo;

  if (productOrderItemEntity?.quantity > quantityReturned) {
    await strapi.entityService.update(
      'api::product-order-item.product-order-item',
      productOrderItemId,
      {
        data: {
          quantity: productOrderItemEntity?.quantity - quantityReturned,
          serializes: newSerialNumbersForOrder as ID[],
          isPartiallyReturned: isMemoOrder,
          isFullyReturned: false,
        },
      },
    );

    if (serializes && serializes?.length > 0) {
      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        productOrderItemEntity.product.id,
        {
          data: {
            serializes: concat(
              actualSerialNumbersInProductInventoryItem,
              serializes,
            ) as ID[],
          },
        },
      );
    }
  } else {
    await strapi.entityService.update(
      'api::product-order-item.product-order-item',
      productOrderItemId,
      {
        data: {
          quantity: 0,
          serializes: [],
          isPartiallyReturned: false,
          isFullyReturned: isMemoOrder,
        },
      },
    );

    if (serializes && serializes?.length > 0) {
      await strapi.entityService.update(
        'api::product-inventory-item.product-inventory-item',
        productOrderItemEntity.product.id,
        {
          data: {
            serializes: concat(
              actualSerialNumbersInProductInventoryItem,
              serializes,
            ) as ID[],
          },
        },
      );
    }
  }
};
