export enum ActivityType {
  TASK = 'task',
  MEETING = 'meeting',
  MAIL = 'email',
  VOICE_MAIL = 'voice_mail',
  POINTS = 'points',
  CALL = 'call',
  PURCHASE = 'purchase',
  RECORD = 'record',
  REVIEW = 'review',
  CONVERSATION = 'conversation',
  RETURN = 'return',
  APPRAISAL = 'appraisal',
  DEAL = 'deal',
  NOTE = 'note',
  SHOPIFY = 'shopify',
  SEND = 'send',
}

export enum LeadSource {
  WALK_IN = 'walk_in',
  EXTERNAL_REFERRAL = 'external_referral',
  ONLINE_STORE = 'online_store',
  WEBSITE = 'website',
  ADVERTISEMENT = 'advertisement',
  GOOGLE_AD = 'google_ad',
  FACEBOOK_AD = 'facebook_ad',
  INSTAGRAM = 'instagram',
  TIK_TOK = 'tik_tok',
  GOOGLE_SEARCH = 'google_search',
  UNKNOWN = 'unknown',
}

export enum CustomerPriceGroup {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
}

export enum CompanyType {
  PROSPECT = 'prospect',
  VENDOR = 'vendor',
}

export enum LeadStage {
  DEFAUlT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum PriorityType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  INACTIVE = 'inactive',
}

export enum DeliveryMethod {
  COURIER = 'Courier',
  FEDEX = 'FedEx',
  DHL_EXPRESS = 'DHL_Express',
  ONTRACK = 'OnTrac',
  UPS = 'UPS',
  USPS = 'USPS',
  US_FOODS = 'US_Foods',
}

export enum OrderType {
  SELL = 'sell',
  LAYAWAY = 'layaway',
  RENT = 'rent',
  TRADEIN = 'tradeIn',
  PURCHASE = 'purchase',
}

export enum SalesItemReportType {
  PRODUCT = 'product',
  COMPOSITE_PRODUCT = 'composite_product',
  SERVICE = 'service',
  MEMBERSHIP = 'membership',
  CLASS = 'class',
}

export enum CustomerType {
  CONTACT = 'contact',
  COMPANY = 'company',
  LEAD = 'lead',
}

export enum EnumSizeUnit {
  CM = 'cm',
  FT = 'ft',
  IN = 'in',
  M = 'm',
  MM = 'mm',
  YD = 'yd',
}

export enum EnumWeightUnit {
  MG = 'mg',
  G = 'g',
  KG = 'kg',
  GR = 'gr',
  OZ = 'oz',
  LB = 'lb',
  CT = 'ct',
  DWT = 'dwt',
}

export enum StatisticCardFormsStages {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  DECLINED = 'declined',
}

export enum StatisticCardTransactionsStages {
  PAID = 'accepted',
  OUTSTANDING = 'pending',
  OVERDUE = 'overdue',
}

export enum Purchase {
  PAID = 'accepted',
  OUTSTANDING = 'pending',
  OVERDUE = 'overdue',
}

export enum StatisticCardAppraisalStages {
  COMPLETED = 'completed',
}

export type PrintSizeType =
  | '1x1'
  | '2-1-4x1-1-4'
  | '3-8x3-4'
  | '7-16x3-1-2'
  | '7-16x3-1-2L'
  | '7-8x15-16'
  | '1-2x1-15-16'
  | '9-16x4-3-8'
  | '7-16x2-1-2'
  | '3-8x2-3-4'
  | '7-16x3-4-4'
  | '9-16x4-1-8';

export enum AddCreditsSelection {
  ONE_HUNDRED = 100,
  TWO_HUNDRED_FIFTY = 250,
  FIVE_HUNDRED = 500,
  ONE_THOUSAND = 1000,
}

export enum ImportingKeyIdentifierEnum {
  ORDERS = 'orders',
  PRODUCTS = 'products',
  UPDATE_DEFAULT_PRICE = 'updateDefaultPrice',
  CONTACTS = 'contacts',
  CONTACT_RELATIONS = 'contactRelations',
  WISHLIST = 'wishlist',
  COMPANIES = 'companies',
}

export enum MarketingOptionIn {
  YES = 'Yes',
  NO = 'No',
  NA = 'N_A',
}

export enum ShippingTypeEnum {
  SERVICE = 'service',
  PRODUCT = 'product',
}
