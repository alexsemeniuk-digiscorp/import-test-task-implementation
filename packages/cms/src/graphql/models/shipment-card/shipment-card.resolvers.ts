import { apartment } from './resolvers/apartment';
import { email } from './resolvers/email';
import { phoneNumber } from './resolvers/phoneNumber';
import { postcode } from './resolvers/postcode';
import { streetName } from './resolvers/streetName';

export const shipmentCardResolvers = {
  email,
  phoneNumber,
  postcode,
  streetName,
  apartment,
};
