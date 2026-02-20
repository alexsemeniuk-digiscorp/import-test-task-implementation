import { generateId } from '../../utils/randomBytes';
import { LifecycleHook } from './types';

export const appendRegexedId: LifecycleHook = async ({ params, model }) => {
  let regexedKeyName;
  switch (model.uid) {
    case 'api::business-location.business-location':
      regexedKeyName = 'businessLocationId';
      break;
    case 'api::deal-transaction.deal-transaction':
      regexedKeyName = 'dealTransactionId';
      break;
    case 'api::order.order':
      regexedKeyName = 'orderId';
      break;
    case 'api::product.product':
      regexedKeyName = 'productId';
      break;
    case 'api::service.service':
      regexedKeyName = 'serviceId';
      break;
    case 'api::membership.membership':
      regexedKeyName = 'membershipId';
      break;
    case 'api::class.class':
      regexedKeyName = 'classId';
      break;
    default:
      regexedKeyName = 'regexedId';
  }
  params.data[regexedKeyName] = params.data[regexedKeyName] || generateId();
};
