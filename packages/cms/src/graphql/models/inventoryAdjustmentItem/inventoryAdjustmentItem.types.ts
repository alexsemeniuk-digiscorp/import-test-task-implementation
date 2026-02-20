import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export interface CreateInventoryAdjustmentWithItemsByInventoryAuditInput {
  id: ID;
  adjustmentId: string;
  auditId: string;
  employee: ID;
  name?: string;
}
