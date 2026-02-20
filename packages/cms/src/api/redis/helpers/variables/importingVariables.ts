export const IMPORTING_SESSION_KEY = 'importingSession';
export const SPOILED_CREATIONS = 'spoiledCreations';
export const COMPLETED_CREATIONS = 'completedCreations';
export const UPDATED_CREATIONS = 'updatedCreations';
export const CONTACTS_IMPORT_IDENTIFIER = 'contacts';
export const COMPANIES_IMPORT_IDENTIFIER = 'companies';
export const PRODUCTS_IMPORT_IDENTIFIER = 'products';
export const INVENTORY_REPORT_EXPORT_DATA_IDENTIFIER = 'inventoryReportExport';
export const INVENTORY_ITEM_REPORT_EXPORT_DATA_IDENTIFIER =
  'inventoryItemReportExport';
export const SALES_ITEM_REPORT_EXPORT_DATA_IDENTIFIER = 'salesItemReportExport';
export const CUSTOMERS_REPORT_EXPORT_DATA_IDENTIFIER = 'customersReportExport';
export const SALES_ORDER_REPORT_EXPORT_DATA_IDENTIFIER =
  'salesOrderReportExport';
export const DAILY_SUMMARY_REPORT_EXPORT_DATA_IDENTIFIER =
  'dailySummaryReportExport';
export const TAX_REPORT_EXPORT_DATA_IDENTIFIER = 'taxReportExport';
export const MEMO_IN_REPORT_EXPORT_DATA_IDENTIFIER = 'memoInReportExport';
export const MEMO_OUT_REPORT_EXPORT_DATA_IDENTIFIER = 'memoOutReportExport';
export const MARKETING_REPORT_EXPORT_DATA_IDENTIFIER = 'marketingReportExport';
export const CONTACT_RELATIONS_IMPORT_IDENTIFIER = 'contactRelations';
export const ORDERS_IMPORT_IDENTIFIER = 'orders';
export const IMAGES_BULK_UPLOAD_IDENTIFIER = 'imagesBulkUpload';
export const FAST_UPDATE_PRODUCT_IDENTIFIER = 'fastUpdateProduct';
export const UPDATE_DEFAULT_PRICE_IDENTIFIER = 'updateDefaultPrice';
export const FAST_UPDATE_CONTACT_IDENTIFIER = 'fastUpdateContact';
export const FAST_UPDATE_COMPANY_IDENTIFIER = 'fastUpdateCompany';
export const WISHLIST_IMPORT_IDENTIFIER = 'wishlist';
export const FILES_IMPORT_IDENTIFIER = 'files';
const TOTAL_FIELDS_COUNT_KEY = 'totalFieldsCount';
const PROCESSED_FIELDS_COUNT_KEY = 'processedFieldsCount';
const METADATA_KEY = 'metadata';

export const isProcessingJob = (regexedId, tenantId) => {
  return `${IMPORTING_SESSION_KEY}:${regexedId}:${tenantId}`;
};

export const importingFilesSession = (importingSessionId, tenantId) => {
  return `${FILES_IMPORT_IDENTIFIER}:${importingSessionId}:${tenantId}`;
};

export const importingTotalFieldsCount = (
  regexedId,
  tenantId,
  importIdentifier,
) => {
  return `${IMPORTING_SESSION_KEY}:${importIdentifier}:${regexedId}:${tenantId}:${TOTAL_FIELDS_COUNT_KEY}`;
};

export const importingProcessedFieldsCount = (
  regexedId,
  tenantId,
  importIdentifier,
) => {
  return `${IMPORTING_SESSION_KEY}:${importIdentifier}:${regexedId}:${tenantId}:${PROCESSED_FIELDS_COUNT_KEY}`;
};

export const importingMetadata = (regexedId, tenantId, importIdentifier) => {
  return `${IMPORTING_SESSION_KEY}:${importIdentifier}:${regexedId}:${tenantId}:${METADATA_KEY}`;
};

export const spoiledImportingData = (regexedId, tenantId, importIdentifier) => {
  return `${SPOILED_CREATIONS}:${importIdentifier}:${regexedId}:${tenantId}`;
};

export const updatingImportingData = (
  regexedId,
  tenantId,
  importIdentifier,
) => {
  return `${UPDATED_CREATIONS}:${importIdentifier}:${regexedId}:${tenantId}`;
};

export const completedImportingData = (
  regexedId,
  tenantId,
  importIdentifier,
) => {
  return `${COMPLETED_CREATIONS}:${importIdentifier}:${regexedId}:${tenantId}`;
};

export const paginatedCreationsData = (
  type,
  regexedId,
  tenantId,
  importIdentifier,
) => {
  return `${type}:${importIdentifier}:${regexedId}:${tenantId}`;
};
