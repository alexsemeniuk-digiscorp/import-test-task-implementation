import { GraphQLFieldResolver } from 'graphql';

import { generateId } from '../../../../utils/randomBytes';
import { OrderInvoiceInput } from '../order.types';

export const generateInvoice: GraphQLFieldResolver<
  null,
  null,
  { input: OrderInvoiceInput }
> = async (root, { input }) => {
  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.orderId,
    {
      fields: ['id'],
      populate: {
        contact: {
          fields: ['id', 'fullName', 'address', 'email', 'phoneNumber'],
        },
        company: {
          fields: ['id', 'name', 'address', 'email', 'phoneNumber'],
        },
        tenant: {
          fields: ['id'],
        },
      },
    },
  );

  const shippingContact = await strapi.entityService.create(
    'api::invoice-shipping-contact.invoice-shipping-contact',
    {
      data: {
        name: order.company?.name || order.contact?.fullName,
        address: order.company?.address || order.contact?.address,
        email: order.company?.email || order.contact?.email,
        phoneNumber: order.company?.phoneNumber || order.contact?.phoneNumber,
      },
    },
  );

  return await strapi.entityService.create('api::invoice.invoice', {
    data: {
      orderId: order.id,
      tenant: order.tenant.id,
      invoiceId: generateId(),
      shippingContact: shippingContact.id,
    },
  });
};
