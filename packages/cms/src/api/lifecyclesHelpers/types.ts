export interface Params {
  data: any;
  select: any;
  where: any;
  orderBy: any;
  limit: any;
  offset: any;
  populate: any;
}

interface Model {
  singularName: string;
  uid: string;
  tableName: string;
  attributes: Record<string, any>;
}
export interface Event {
  action: string;
  model: Model;
  params: any;
  result?: Record<string, any>;
  state?: Record<string, any>;
}

export type LifecycleHook = (event: Event) => Promise<void>;

export type CrmEntityName = 'contact' | 'company' | 'lead';

export type CrmEntityUid =
  | 'api::contact.contact'
  | 'api::company.company'
  | 'api::lead.lead';

export type OperationType = 'create' | 'update';

export type OrderItemEntityType =
  | 'products'
  | 'classes'
  | 'services'
  | 'compositeProducts'
  | 'memberships';

export type SalesItemReportType =
  | 'product'
  | 'class'
  | 'service'
  | 'composite_product'
  | 'membership';

export type OrderItemEntityApiType =
  | 'api::product-order-item.product-order-item'
  | 'api::class-order-item.class-order-item'
  | 'api::service-order-item.service-order-item'
  | 'api::composite-product-order-item.composite-product-order-item'
  | 'api::membership-order-item.membership-order-item';

export interface ServiceJsonType {
  depositToAccount?: string;
  prePaymentServicePurchase?: string;
  prePaymentService?: string;
  class?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  realmId?: string;
  billPaymentAccount?: string;
  prePaymentAccountPurchase?: string;
  refundAccount?: string;
  refundService?: string;
  defaultRevenue?: string;
  defaultCost?: string;
  inventoryAsset?: string;
  defaultPaymentMethod?: string;
  defaultPurchasePaymentMethod?: string;
  defaultPaymentType?: string;
  xeroTenantId?: string;
  defaultDiscount?: string;
  department?: string;
  defaultPointDiscount?: string;
  defaultPointDiscountPurchase?: string;
  productAccountingService?: string;
  purchaseProductAccountingService?: string;
  serviceAccountingService?: string;
  purchaseServiceAccountingService?: string;
  contactAccountingService?: string;
  purchaseContactAccountingService?: string;
}

export type AccountingserviceEntityName = 'contact' | 'product' | 'service';
export type AccountingserviceOperation = 'create' | 'update' | 'delete';
