import { addDiscount } from './resolvers/addDiscount';
import { addFollowingTransactions } from './resolvers/addFollowingTransactions';
import { addPaymentMethodCustomer } from './resolvers/addPaymentMethodCustomer';
import { addPoints } from './resolvers/addPoints';
import { addTip } from './resolvers/addTip';
import { amountPaidPreTax } from './resolvers/amountPaidPreTax';
import { cancelPaymentIntentForPos } from './resolvers/cancelPaymentIntentForPos';
import { compositeProductsPortion } from './resolvers/compositeProductsPortion';
import { createLocationForPos } from './resolvers/createLocationForPos';
import { createOrdersFromCSV } from './resolvers/createOrdersFromCSV';
import { createPaymentIntentForPos } from './resolvers/createPaymentIntentForPos';
import { generateEstimate } from './resolvers/generateEstimate';
import { generateInvoice } from './resolvers/generateInvoice';
import { getCreateDate } from './resolvers/getCreateDate';
import { getPosTerminalList } from './resolvers/getPosTerminalList';
import { itemsAmount } from './resolvers/itemsAmount';
import { moveWholesaleToSell } from './resolvers/moveWholesaleToSell';
import { orderPayment } from './resolvers/orderPayment';
import { paidSummary } from './resolvers/paidSummary';
import { preTaxSales } from './resolvers/preTaxSales';
import { productsPortion } from './resolvers/productsPortion';
import { removeDiscount } from './resolvers/removeDiscount';
import { removePosLocation } from './resolvers/removePosLocation';
import { servicesPortion } from './resolvers/servicesPortion';
import { specifiedTaxPortions } from './resolvers/specifiedTaxPortions';
import { specifiedTaxPortionsAdjustedPrices } from './resolvers/specifiedTaxPortionsAdjustedPrices';

import { taxPortion } from './resolvers/taxPortion';
import { updateCustomerOrder } from './resolvers/updateCustomerOrder';
import { updateInventoryAfterPurchase } from './resolvers/updateInventoryAfterPurchase';
import { updateStripePaymentMethodType } from './resolvers/updateStripePaymentMethodType';

import { addFollowingGatewayTransactions } from './resolvers/addFollowingGatewayTransactions';
import { inventoryPurchaseFormMutation } from './resolvers/inventoryPurchaseFormMutation';
import { notifyOrderCustomer } from './resolvers/notifyOrderCustomer';
import { reportExportCSV } from './resolvers/reportExportCSV';
import { reportExportData } from './resolvers/reportExportData';
import { salesByItemCategoryReport } from './resolvers/salesByItemCategoryReport';
import { splitOrder } from './resolvers/splitOrder';

export const OrderMutations = {
  addDiscount,
  addTip,
  generateInvoice,
  generateEstimate,
  addPoints,
  updateCustomerOrder,
  addFollowingTransactions,
  createPaymentIntentForPos,
  orderPayment,
  addPaymentMethodCustomer,
  createLocationForPos,
  removePosLocation,
  updateInventoryAfterPurchase,
  cancelPaymentIntentForPos,
  updateStripePaymentMethodType,
  removeDiscount,
  createOrdersFromCSV,
  moveWholesaleToSell,
  inventoryPurchaseFormMutation,
  addFollowingGatewayTransactions,
  // syncAttachmentWithAccountingServices,
  splitOrder,
  notifyOrderCustomer,
};

export const OrderQueries = {
  getPosTerminalList,
  salesByItemCategoryReport,
  reportExportCSV,
  reportExportData,
};

export const OrdersResolvers = {
  itemsAmount,
  paidSummary,
  taxPortion,
  specifiedTaxPortions,
  specifiedTaxPortionsAdjustedPrices,
  getCreateDate,
  productsPortion,
  compositeProductsPortion,
  servicesPortion,
  preTaxSales,
  amountPaidPreTax,
};
