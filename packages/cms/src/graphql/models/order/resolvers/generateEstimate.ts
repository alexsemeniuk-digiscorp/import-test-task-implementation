import { GraphQLFieldResolver } from 'graphql';

import { generateId } from '../../../../utils/randomBytes';
import { OrderEstimateInput } from '../order.types';

export const generateEstimate: GraphQLFieldResolver<
  null,
  null,
  { input: OrderEstimateInput }
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
    'api::estimate-shipping-contact.estimate-shipping-contact',
    {
      data: {
        name: order.company?.name || order.contact?.fullName,
        address: order.company?.address || order.contact?.address,
        email: order.company?.email || order.contact?.email,
        phoneNumber: order.company?.phoneNumber || order.contact?.phoneNumber,
      },
    },
  );

  return await strapi.entityService.create('api::estimate.estimate', {
    data: {
      orderId: order.id,
      tenant: order.tenant.id,
      estimateId: generateId(),
      shippingContact: shippingContact.id,
    },
  });
};
