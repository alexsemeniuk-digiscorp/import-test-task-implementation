import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { AnyObject } from '../../helpers/types';

export interface OrderDiscountInput {
  id: ID;
  orderId: ID;
}

export interface OrderTipInput {
  tip: number;
  orderId: ID;
  isResetTip?: boolean;
}

export interface OrderInvoiceInput {
  orderId: ID;
}

export interface OrderPurchaseRequestInput {
  orderId: ID;
}

export interface OrderEstimateInput {
  orderId: ID;
}

export interface OrderPointsInput {
  points: number;
  orderId: ID;
}

export interface UpdateCustomerOrderInput {
  info: string;
  orderId: ID;
}

export interface OrderPaymentInput {
  orderId: string;
  paymentMethodId: string;
  customer: {
    email: string;
    name: string;
    customerId: string;
  };
  saveMyCard: boolean;
  accountId: string;
}

export interface CreatePaymentIntentForPosInput {
  orderId: string;
  terminalId: string;
  accountId: string;
}

export interface CreateLocationForPosInput {
  display_name: string;
  registration_code: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  accountId: string;
}

export interface CreateLocationForPosInputResponse {
  locationId: string;
}

export interface UpdateInventoryAfterPurchaseInput {
  orderId: ID;
  products: {
    quantity: number;
    id: ID;
  }[];
}

export interface CancelPaymentIntentForPosInput {
  paymentIntentId: string;
  accountId: string;
  terminalId: string;
}
export interface WholesaleToSellInput {
  id: ID;
}
export interface UpdateStripePaymentMethodTypeInput {
  accountId: string;
  paymentIntentId: string;
  dealTransactionId: string;
}

export interface PaymentMethodType {
  id: ID;
  name?: string;
}
export interface InventoryPurchaseFormInput {
  preparedArrayProductInventory: {
    productInventoryItem: string;
    sublocationId: string;
    quantity: number;
    orderItem: string;
    sublocations: (string | number)[];
    sublocationItems: (string | number)[];
  }[];
  serialsNumbers: { [p: string]: (string | number)[] };
}

export interface SalesByItemCategoryArgs {
  queryType: 'years' | 'months' | 'incomeChart' | 'dashboardChart';
  chartType: 'revenue' | 'category' | 'item' | 'subitem';
  targetYear?: string;
  parentId?: ID;
  startElem?: number;
  additionalFilters?: AnyObject;
}

export interface AttachmentSyncInput {
  orderId: ID;
}

export interface SplitOrderItemInput {
  id: ID;
  quantity: number;
}

export interface SplitOrderInput {
  orderId: string;
  productItems?: SplitOrderItemInput[];
  serviceItems?: SplitOrderItemInput[];
  compositeProductItems?: SplitOrderItemInput[];
  membershipItems?: SplitOrderItemInput[];
  classItems?: SplitOrderItemInput[];
  memo?: number;
}
