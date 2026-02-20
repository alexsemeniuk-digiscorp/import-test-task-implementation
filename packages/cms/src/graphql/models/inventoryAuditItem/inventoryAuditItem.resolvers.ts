import { fetchAuditItemsStats } from './resolvers/fetchAuditItemsStats';
import { fetchInventoryAuditItemsByUuid } from './resolvers/fetchInventoryAuditItemsByUuid';
import { fetchListByFieldFromInventoryAuditItems } from './resolvers/fetchListsByFieldFromInventoryAudit';
import { inventoryAuditItemRangeData } from './resolvers/inventoryAuditItemRangeData';

export const InventoryAuditItemQueries = {
  inventoryAuditItemRangeData,
  fetchAuditItemsStats,
  fetchListByFieldFromInventoryAuditItems,
  fetchInventoryAuditItemsByUuid,
};
