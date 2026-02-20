import { address } from './resolvers/address';
import { email } from './resolvers/email';
import { phoneNumber } from './resolvers/phoneNumber';

export const purchaseRequestShippingInfoResolvers = {
  email,
  phoneNumber,
  address,
};
