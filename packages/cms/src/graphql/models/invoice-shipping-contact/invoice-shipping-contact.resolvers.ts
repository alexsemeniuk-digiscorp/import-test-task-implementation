import { address } from './resolvers/address';
import { email } from './resolvers/email';
import { phoneNumber } from './resolvers/phoneNumber';

export const invoiceShippingContactResolvers = {
  email,
  phoneNumber,
  address,
};
