import { syncDealTransactionWithAccountingService } from '../../../lifecyclesHelpers/accountingServices/syncDealTransactionWithAccountingService';
import { appendCustomCreationDate } from '../../../lifecyclesHelpers/appendCustomCreationDate';
import { appendRegexedId } from '../../../lifecyclesHelpers/appendRegexedId';
import { addPaymentMethodsOnCancelTxn } from '../../../lifecyclesHelpers/dealTransactions/addPaymentMethodsOnCancelTxn';
import { transactionStatusCheck } from '../../../lifecyclesHelpers/dealTransactions/transactionStatusCheck';
import { lifecyclesHookDecorator } from '../../../lifecyclesHelpers/decorator';

export default {
  beforeCreate: lifecyclesHookDecorator([
    transactionStatusCheck,
    appendRegexedId,
    appendCustomCreationDate,
  ]),
  beforeUpdate: lifecyclesHookDecorator([transactionStatusCheck]),
  afterUpdate: lifecyclesHookDecorator([
    addPaymentMethodsOnCancelTxn,
    syncDealTransactionWithAccountingService('update'),
  ]),
  afterCreate: lifecyclesHookDecorator([
    syncDealTransactionWithAccountingService('create'),
  ]),
};
