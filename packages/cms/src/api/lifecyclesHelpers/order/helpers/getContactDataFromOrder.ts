import { getFirstName } from '../../../../graphql/helpers/getFirstName';
import { type OrderContactData } from '../types';

export const getContactDataFromOrder = (order: any): OrderContactData => {
  if (order?.contact) {
    return {
      contact: order.contact,
      company: null,
      firstName: order.contact.fullName
        ? getFirstName(order.contact.fullName)
        : 'Client',
    };
  }

  if (order?.company) {
    return {
      contact: null,
      company: order.company,
      firstName: order.company.name || 'Client',
    };
  }

  return {
    contact: null,
    company: null,
    firstName: 'Client',
  };
};
