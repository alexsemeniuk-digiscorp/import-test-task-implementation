import { createInventoryAuditWithItemsByRedis } from './resolvers/createInventoryAuditWithItemsByRedis';
import { getInventoryAuditMin } from './resolvers/getInventoryAuditMin';
import { isInventoryNotEqualScanned } from './resolvers/isScannedNotEqualActual';
import { updateFinalizeInventoryAudit } from './resolvers/updateFinalizeInventoryAudit';

export const InventoryAuditMutations = {
  createInventoryAuditWithItemsByRedis,
  updateFinalizeInventoryAudit,
};
export const InventoryAuditQueries = {
  getInventoryAuditMin,
};

export const InventoryAuditResolvers = {
  isInventoryNotEqualScanned,
};
