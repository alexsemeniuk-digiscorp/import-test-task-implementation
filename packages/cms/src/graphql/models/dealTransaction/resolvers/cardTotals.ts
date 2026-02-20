import { GraphQLFieldResolver } from 'graphql';

import { getAccountingDashboardCardsInfo } from './cardBuilders/accountingDashboard';

import { AnyObject } from '../../../helpers/types';
import { getAccountingDealTransactionsCardsInfo } from './cardBuilders/accountingDealTransactions';
import { getCrmDashboardCardsInfo } from './cardBuilders/crmDashboard';
import { getMainDashboardCardsInfo } from './cardBuilders/mainDasboard';
import { getMarketingCardsInfo } from './cardBuilders/marketing';
import { getReportAccrualSummaryCardsInfo } from './cardBuilders/reportAccrualSummary';
import { getReportAccrualTaxesCardsInfo } from './cardBuilders/reportAccrualTaxes';
import { getReportDailySummaryCardsInfo } from './cardBuilders/reportDailySummary';
import { getReportInventoryCardsInfo } from './cardBuilders/reportInventory';
import { getReportInventoryItemCardsInfo } from './cardBuilders/reportInventoryItem';
import { getReportMarketingCardsInfo } from './cardBuilders/reportMarketing';
import { getReportMemoCardsInfo } from './cardBuilders/reportMemo';
import { getReportMemoOutCardsInfo } from './cardBuilders/reportMemoOut';
import { getReportSalesByItemCategoryCardsInfo } from './cardBuilders/reportSalesByItemCategory';
import { getReportSalesItemCardsInfo } from './cardBuilders/reportSalesItem';
import { getReportSellingCardsInfo } from './cardBuilders/reportSelling';
import { getReportTaxesCardsInfo } from './cardBuilders/reportTaxes';
import { getSellingCardsInfo } from './cardBuilders/selling';
import { getTimeTrackerTotalTime } from './cardBuilders/timeTrackerTotalTime';

export interface CardTotalsArg {
  pageName?:
    | 'dashboard'
    | 'transactions'
    | 'main-dashboard'
    | 'selling'
    | 'daily-summary'
    | 'reports-selling'
    | 'reports-customer'
    | 'reports-inventory'
    | 'reports-inventory-item'
    | 'reports-sales-by-item-category'
    | 'reports-accrual-summary'
    | 'reports-accrual-taxes'
    | 'marketing'
    | 'reports-taxes'
    | 'reports-marketing'
    | 'reports-memo'
    | 'reports-memo-out'
    | 'reports-sales-item'
    | 'crm-dashboard'
    | 'time-tracker';
  businessLocation?: string | number;
  additionalFilters?: AnyObject;
  startPeriodDate?: Date;
  endPeriodDate?: Date;
  entityIds?: string[];
}

export const cardTotals: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { data: CardTotalsArg }
> = async (root, args, ctx) => {
  if (args?.data?.pageName === 'dashboard') {
    return await getAccountingDashboardCardsInfo(
      ctx.state.user.id,
      args?.data?.businessLocation,
    );
  }

  if (args?.data?.pageName === 'transactions') {
    return await getAccountingDealTransactionsCardsInfo(
      ctx.state.user.id,
      args?.data?.businessLocation,
      args?.data?.additionalFilters,
    );
  }

  if (args?.data?.pageName === 'main-dashboard') {
    return await getMainDashboardCardsInfo(
      ctx.state.user.id,
      args?.data?.businessLocation,
    );
  }

  if (args?.data?.pageName === 'selling') {
    return await getSellingCardsInfo(
      ctx.state.user.id,
      args?.data?.businessLocation,
    );
  }
  if (args?.data?.pageName === 'daily-summary') {
    return await getReportDailySummaryCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-selling') {
    return await getReportSellingCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-sales-item') {
    return await getReportSalesItemCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-sales-by-item-category') {
    return await getReportSalesByItemCategoryCardsInfo(
      ctx.state.user.id,
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-accrual-summary') {
    return await getReportAccrualSummaryCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-accrual-taxes') {
    return await getReportAccrualTaxesCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.entityIds,
      'platform',
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-inventory') {
    return await getReportInventoryCardsInfo(
      ctx.state.user.id,
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-inventory-item') {
    return await getReportInventoryItemCardsInfo(
      ctx.state.user.id,
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-memo') {
    return await getReportMemoCardsInfo(
      ctx.state.user.id,
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-memo-out') {
    return await getReportMemoOutCardsInfo(
      ctx.state.user.id,
      args?.data?.additionalFilters,
    );
  }
  if (args?.data?.pageName === 'reports-taxes') {
    return await getReportTaxesCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.entityIds,
      'platform',
      args?.data?.additionalFilters,
    );
  }

  if (args?.data?.pageName === 'marketing') {
    return await getMarketingCardsInfo(ctx.state.user.id);
  }

  if (args?.data?.pageName === 'reports-marketing') {
    return await getReportMarketingCardsInfo(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.additionalFilters,
    );
  }

  if (args?.data?.pageName === 'crm-dashboard') {
    return await getCrmDashboardCardsInfo(ctx.state.user.id);
  }

  if (args?.data?.pageName === 'time-tracker') {
    return await getTimeTrackerTotalTime(
      ctx.state.user.id,
      [args?.data?.startPeriodDate, args?.data?.endPeriodDate],
      args?.data?.additionalFilters,
    );
  }
};
