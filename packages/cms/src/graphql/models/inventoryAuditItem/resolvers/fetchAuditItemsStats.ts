import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { handleError } from '../../../helpers/errors';

import {
  InventoryAuditItemFilters,
  generateFilters,
} from '../helpers/generateFilters';

import { INVENTORY_AUDIT_STATS } from '../redis/constants/inventoryAuditStats.constants';
import { inventoryAuditStatsQueueService } from '../redis/queues/inventoryAuditStats.queue';

export const fetchAuditItemsStats: GraphQLFieldResolver<
  undefined,
  unknown,
  {
    filters: InventoryAuditItemFilters;
    auditUuid: string;
    skip?: boolean;
  }
> = async (
  source: undefined,
  input,
  context: unknown,
  info: GraphQLResolveInfo,
) => {
  const { filters: filtersInput, auditUuid } = input;
  const filters = generateFilters(filtersInput);

  if (!auditUuid) {
    throw new Error('auditUuid is required');
  }

  try {
    const inventoryAuditItems = await strapi.entityService.findMany(
      'api::inventory-audit-item.inventory-audit-item',
      {
        filters: {
          ...(auditUuid
            ? { inventoryAudit: { uuid: { $eq: auditUuid } } }
            : {}),
          ...filters,
        },
        fields: ['scannedQty', 'actualQty', 'inventoryQty'],
      },
    );

    const job = await inventoryAuditStatsQueueService.addFlowJob(
      INVENTORY_AUDIT_STATS,
      {
        items: inventoryAuditItems,
      },
    );
    const result = await job.job.waitUntilFinished(
      inventoryAuditStatsQueueService.getEvents(),
    );
    return result;
  } catch (err) {
    handleError(
      `Resolver :: fetchAuditItemsStats`,
      `${err.message}`,
      undefined,
    );
  }
};
