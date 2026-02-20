import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export interface CreateInventoryAuditWithItemsInput {
  auditDate: string;
  auditId: string;
  businessLocation: ID;
  employee: ID;
  name: string;
  sublocation?: ID;
  tenant: ID;
  productType?: ID;
  company?: ID;
  contact?: ID;
  inventoryQty?: boolean;
}

export interface InventoryAuditItemsByFiltersInput {
  name?: string;
  barcode?: string;
  vendor?: ID;
  price?: string;
  inventoryQty?: number;
  scannedQty?: number;
  scanned?: boolean;
  adjusted?: boolean;
}
