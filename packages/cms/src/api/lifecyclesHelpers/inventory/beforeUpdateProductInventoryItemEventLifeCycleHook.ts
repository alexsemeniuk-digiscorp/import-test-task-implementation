import { handleLogger } from '../../../graphql/helpers/errors';
import { saleItemReportMarginGrossUpdateOnItemCostChange } from '../reports/saleItemReportMarginGrossUpdateOnItemCostChange';
import { LifecycleHook } from '../types';
import { updateProductInventoryItemRecordsAgeOnSell } from './updateProductInventoryItemRecordsAgeOnSell';
import { updateProductInventoryItemRecordsPrice } from './updateProductInventoryItemRecordsPrice';
import { updateProductInventoryItemRecordsQuantity } from './updateProductInventoryItemRecordsQuantity';
import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const beforeUpdateProductInventoryItemEventLifeCycleHook: LifecycleHook =
  async (event: BeforeLifecycleEvent) => {
    // Skip before update product inventory item event during bulk imports for performance
    if (event?.params?.data?._skipBeforeUpdateProductInventoryItemEvent) {
      delete event?.params?.data?._skipBeforeUpdateProductInventoryItemEvent;
      return;
    }

    handleLogger(
      'info',
      'ProductInventoryItemEvent beforeUpdateProductInventoryItemEventLifeCycleHook',
      `Params :: ${JSON.stringify(event.params)}`,
    );

    const entityId = event?.params?.where?.id;

    const currentProductInventoryItemEvent = await strapi.entityService.findOne(
      'api::product-inventory-item-event.product-inventory-item-event',
      entityId,
      {
        fields: [
          'id',
          'change',
          'remainingQuantity',
          'eventType',
          'itemCost',
          'memo',
          'receiveDate',
        ],
        populate: {
          productInventoryItem: {
            fields: ['id', 'price'],
            populate: {
              product: {
                fields: ['id', 'multiplier', 'defaultPrice'],
              },
            },
          },
          productInventoryItemRecords: {
            fields: ['id'],
          },
          tenant: {
            fields: ['id'],
          },
        },
      },
    );

    await updateProductInventoryItemRecordsQuantity(
      event,
      currentProductInventoryItemEvent,
    );
    await updateProductInventoryItemRecordsPrice(
      event,
      currentProductInventoryItemEvent,
    );
    await updateProductInventoryItemRecordsAgeOnSell({ ...event });
    await saleItemReportMarginGrossUpdateOnItemCostChange(
      event,
      currentProductInventoryItemEvent,
    );
  };
