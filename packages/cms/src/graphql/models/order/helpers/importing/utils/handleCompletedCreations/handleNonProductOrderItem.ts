import { generateUUID } from '../../../../../../../utils/randomBytes';
import { handleError } from './../../../../../../helpers/errors';

export const handleNonProductOrderItem = async (
  items,
  { businessLocationId, orderId },
  { entityType, idField, uid, orderItemUid, tenantId, userId },
  taxesMap?: Map<string, any>,
  entitiesMap?: Map<string, any>,
  defaultTaxId?: number,
) => {
  if (items?.length === 0) return;

  try {
    await Promise.all(
      items.map(async (item) => {
        // Use pre-fetched tax data instead of querying
        let taxId: number | undefined;
        const taxName = item?.productTax || item?.taxName;

        if (taxName && taxesMap) {
          const tax = taxesMap.get(taxName);
          taxId = tax?.id;
        }

        // Fallback to default tax if specific tax not found
        if (!taxId && defaultTaxId) {
          taxId = defaultTaxId;
        }

        // Use pre-fetched entity data (should always be available)
        let entityId;

        if (entitiesMap && item?.productId) {
          const entity = entitiesMap.get(item.productId);
          entityId = entity?.id;
        }

        if (!entityId) {
          console.error(`Entity not found for ${entityType}:`, item?.productId);
          return;
        }

        let linkedEntityId = entityId;

        // Prepare order item data (same for all entity types)
        const orderItemData = {
          note: item?.note,
          itemId: generateUUID(),
          quantity: item?.quantity,
          price: item?.price,
          [entityType]: linkedEntityId,
          order: orderId,
          tax: taxId,
          businessLocation: businessLocationId,
          purchaseType: 'buy' as any,
          _skipBeforeCreateOrderItem: true,
          _skipCreateFollowingActivityInExistingOrder: true,
          _skipBeforeUpdateOrder: true,
          _skipAfterUpdateOrder: true,
          _skipMeilisearchSync: true,
        };

        if (entityType === 'class' || entityType === 'service') {
          const performerUid =
            entityType === 'service'
              ? 'api::service-performer.service-performer'
              : 'api::class-performer.class-performer';

          const performer = await strapi.entityService.create(performerUid, {
            data: {
              isImported: true,
              performer: userId,
              tenant: tenantId,
              _skipActiveStatusSet: true,
              _skipAppendActualPrice: true,
            },
          });

          // Update linkedEntityId and order item data to use performer
          linkedEntityId = performer?.id;
          orderItemData[entityType] = linkedEntityId;

          // Skip task creation for service performer during import
          if (entityType === 'service') {
            (orderItemData as any)._skipAddTaskForServicePerformer = true;
          }

          // Run location info creation in parallel with order item creation
          const locationInfoPromise =
            entityType === 'service'
              ? strapi.entityService.create(
                  'api::service-location-info.service-location-info',
                  {
                    data: {
                      service: entityId,
                      servicePerformers: [performer.id as number],
                      businessLocation: businessLocationId,
                      _skipMeilisearchSync: true,
                    },
                  },
                )
              : strapi.entityService.create(
                  'api::class-location-info.class-location-info',
                  {
                    data: {
                      class: entityId,
                      classPerformers: [performer.id as number],
                      businessLocation: businessLocationId,
                    },
                  },
                );

          // Create order item and location info in parallel
          await Promise.all([
            locationInfoPromise,
            strapi.entityService.create(orderItemUid, {
              data: orderItemData as any,
            }),
          ]);
        } else {
          // For memberships (no performer needed)
          await strapi.entityService.create(orderItemUid, {
            data: orderItemData as any,
          });
        }
      }),
    );
  } catch (e) {
    handleError('handleNonProductOrderItem', undefined, e);
  }
};
