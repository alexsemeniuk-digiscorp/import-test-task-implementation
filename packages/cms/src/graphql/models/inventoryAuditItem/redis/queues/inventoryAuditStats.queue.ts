import { QueueService } from '../../../../../api/redis/services/QueueService';
import { INVENTORY_AUDIT_STATS } from '../constants/inventoryAuditStats.constants';

import { inventoryAuditStatsProccessor } from '../workers/inventoryAuditStats.worker';

export const inventoryAuditStatsQueueService = new QueueService(
  INVENTORY_AUDIT_STATS,
  inventoryAuditStatsProccessor,
  {
    concurrency: 1,
  },
);
