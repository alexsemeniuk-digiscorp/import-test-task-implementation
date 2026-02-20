import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

import { NexusGenRootTypes } from '../../../../types/generated/graphql';

export interface TimeTotalsArgs {
  queryType: 'years' | 'months' | 'incomeChart' | 'dashboardChart';
  chartType: 'account' | 'category' | 'subcategory';
  targetYear?: string;
  parentId?: ID;
  startElem?: number;
  businessLocation?: ID;
}

export interface IncomeMonthArgsInput {
  accountId?: string;
  categoryId?: string;
  subcategoryId?: string;
  year?: number;
  chartName?: string;
}

export type AccountNames = [
  'Revenue',
  'Cost of Goods Sold',
  'Gross Profit',
  'Expenses',
  'Pre Tax Income',
  'Taxes',
  'Net Income',
  'Inventory Shrinkage',
];

export interface TransactionStatusArgsInput {
  paymentIntentId: string;
  accountId: string;
  txnId: string;
}
export interface PaymentLinkEmailArgsInput {
  email: string;
  paymentLink: string;
}

export type ChartAccountWithPopulatedTransactions =
  NexusGenRootTypes['ChartAccount'] & {
    dealTransactions: NexusGenRootTypes['DealTransaction'][];
  };

export interface CardListArgsInputType {
  email: string;
  accountId: string;
}

export interface ClearentInfo {
  'id': string;
  'merchant-id': string;
  'payloadType': string;
}

export interface StripeInfo {
  paymentIntentId: string;
  message: string;
}

export interface CreateDealTransactionCustomerInput {
  dealTransactionId: string;
  chartAccount: string;
  contact: string;
  dueDate: Date;
  paid: number;
  repetitive: string;
  sellingOrder: string;
  status: string;
  summary: number;
  tenantId: string;
  clearentInfo?: ClearentInfo;
  stripeInfo?: StripeInfo;
  paymentGatewayType?: 'clearent' | 'stripe';
  paymentMethod?: string;
  clearentError?: any;
}

export interface CreateDealTransactionCustomerResponse {
  status: boolean;
}

export interface CreateDealTransactionInventoryShrinkageInput {
  adjustmentID: ID;
}

export interface UpdateDealTransactionClearentInput {
  dealTransactionId: string;
  clearentInfo: ClearentInfo;
  clearentError: any;
}
