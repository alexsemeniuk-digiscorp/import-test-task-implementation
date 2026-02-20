import { LifecycleHook } from '../types';

import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { handleLogger } from '../../../graphql/helpers/errors';
import {
  beginningOfYesterday,
  endOfCurrentDate,
  filterPeriodBuilder,
} from '../../../graphql/models/dealTransaction/helpers/helpers';

export const updateProductInventoryItemRecordsAgeOnSell: LifecycleHook =
  async ({ params }) => {
    handleLogger(
      'info',
      'ProductInventoryItemEvent beforeUpdateProductInventoryItemEventLifeCycleHook updateProductInventoryItemRecordsAgeOnSell',
      `Params :: ${JSON.stringify(params)}`,
    );
    const { data, where } = params;
    const entityId = where?.id;
    const entityChange = data?.change;
    const entityRemainingQuantity = data?.remainingQuantity;

    if (
      entityChange ||
      entityRemainingQuantity === null ||
      entityRemainingQuantity === undefined
    )
      return;

    const currentProductInventoryItemEvent = await strapi.entityService.findOne(
      'api::product-inventory-item-event.product-inventory-item-event',
      entityId,
      {
        fields: ['id', 'remainingQuantity', 'receiveDate'],
        populate: {
          productInventoryItem: {
            fields: ['id'],
          },
        },
        sort: ['createdAt:asc'],
      },
    );

    const currentItemRemainingQuantity =
      currentProductInventoryItemEvent?.remainingQuantity;

    if (entityRemainingQuantity === currentItemRemainingQuantity) return;

    const productInventoryEventService = strapi.service(
      'api::product-inventory-item-event.product-inventory-item-event',
    );

    if (entityRemainingQuantity < currentItemRemainingQuantity) {
      const currentProductInventoryItemRecords =
        await strapi.entityService.findMany(
          'api::invt-itm-record.invt-itm-record',
          {
            filters: {
              productInventoryItemEvent: {
                id: {
                  $eq: entityId,
                },
              },
              soldDate: {
                $eq: null,
              },
            },
            fields: ['id'],
            sort: ['createdAt:asc'],
          },
        );

      if (
        currentProductInventoryItemRecords &&
        currentProductInventoryItemRecords?.length > 0
      ) {
        const orders = await strapi.entityService.findMany('api::order.order', {
          filters: {
            products: {
              product: {
                id: {
                  $eq: currentProductInventoryItemEvent?.productInventoryItem
                    ?.id,
                },
              },
            },
            type: {
              $in: ['sell', 'layaway', 'rent'],
            },
            ...(filterPeriodBuilder(
              beginningOfYesterday.toISOString(),
              endOfCurrentDate.toISOString(),
              'customCreationDate',
            ) as Any<'api::order.order'>),
          },
          fields: ['id', 'memo'],
          sort: ['customCreationDate:desc'],
        });

        const order = orders?.[0];

        const quantityDifference =
          currentItemRemainingQuantity - entityRemainingQuantity;

        const calculatedAge =
          productInventoryEventService.getProductInventoryItemEventAge(
            currentProductInventoryItemEvent,
          );

        const updateRecordsAgeForQuantity = async (quantity: number) => {
          const promises = [];
          const maxRecords = Math.min(
            quantity,
            currentProductInventoryItemRecords.length,
          );
          for (let i = 0; i < maxRecords; i++) {
            const recordId = currentProductInventoryItemRecords[i]?.id;
            if (!recordId) continue;
            promises.push(
              strapi.entityService.update(
                'api::invt-itm-record.invt-itm-record',
                recordId,
                {
                  data: {
                    age: calculatedAge,
                    soldDate: new Date(),
                    sellingOrder: order?.id || null,
                    memoSold: Boolean(order?.memo) || false,
                  },
                },
              ),
            );
          }
          await Promise.all(promises);
        };

        await updateRecordsAgeForQuantity(quantityDifference);
      }
    } else if (entityRemainingQuantity > currentItemRemainingQuantity) {
      const currentProductInventoryItemRecords =
        await strapi.entityService.findMany(
          'api::invt-itm-record.invt-itm-record',
          {
            filters: {
              productInventoryItemEvent: {
                id: {
                  $eq: entityId,
                },
              },
              soldDate: {
                $ne: null,
              },
            },
            fields: ['id'],
            sort: ['createdAt:desc'],
          },
        );

      if (
        currentProductInventoryItemRecords &&
        currentProductInventoryItemRecords?.length > 0
      ) {
        const quantityDifference =
          entityRemainingQuantity - currentItemRemainingQuantity;

        const calculatedAge =
          productInventoryEventService.getProductInventoryItemEventAge(
            currentProductInventoryItemEvent,
          );

        const updateRecordsAgeForQuantity = async (quantity: number) => {
          const promises = [];
          const maxRecords = Math.min(
            quantity,
            currentProductInventoryItemRecords.length,
          );
          for (let i = 0; i < maxRecords; i++) {
            const recordId = currentProductInventoryItemRecords[i]?.id;
            if (!recordId) continue;
            promises.push(
              strapi.entityService.update(
                'api::invt-itm-record.invt-itm-record',
                recordId,
                {
                  data: {
                    age: calculatedAge,
                    soldDate: null,
                    sellingOrder: null,
                    memoSold: false,
                  },
                },
              ),
            );
          }
          await Promise.all(promises);
        };

        await updateRecordsAgeForQuantity(quantityDifference);
      }
    }
  };
