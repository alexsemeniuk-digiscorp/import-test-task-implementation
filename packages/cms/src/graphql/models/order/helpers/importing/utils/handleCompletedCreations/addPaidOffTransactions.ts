import { NexusGenEnums } from '../../../../../../../types/generated/graphql';
import { generateId } from '../../../../../../../utils/randomBytes';
import { handleError } from './../../../../../../helpers/errors';

export const addPaidOffTransactions = async ({
  paidOff,
  isCompany,
  isContact,
  customerId,
  orderId,
  dueDate,
  tenant,
  businessLocationId,
  customDate,
  revenueAccountId,
  cashPaymentMethodId,
}) => {
  try {
    if (paidOff !== null) {
      await strapi.entityService.create(
        'api::deal-transaction.deal-transaction',
        {
          data: {
            summary: paidOff,
            paid: paidOff,
            company: isCompany ? customerId : undefined,
            contact: isContact ? customerId : undefined,
            sellingOrder: orderId,
            dueDate: dueDate ?? customDate ?? new Date(),
            status: 'Paid' as NexusGenEnums['ENUM_DEALTRANSACTION_STATUS'],
            chartAccount: revenueAccountId,
            repetitive:
              'once' as NexusGenEnums['ENUM_DEALTRANSACTION_REPETITIVE'],
            paymentMethod: cashPaymentMethodId,
            dealTransactionId: generateId(),
            tenant,
            customCreationDate: customDate,
            businessLocation: businessLocationId,
            _skipSyncDealTransactionWithAccounting: true,
            _skipMeilisearchSync: true,
          },
        },
      );
    }
  } catch (e) {
    handleError('addPaidOffTransactions', undefined, e);
  }
};
