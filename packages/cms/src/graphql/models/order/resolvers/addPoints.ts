import { errors } from '@strapi/utils';
import { GraphQLFieldResolver } from 'graphql';
import { roundPoints } from '../../../../utils/points';
import { OrderPointsInput } from '../order.types';
const { ApplicationError } = errors;

export const addPoints: GraphQLFieldResolver<
  null,
  null,
  { input: OrderPointsInput }
> = async (root, { input }, ctx, info) => {
  const order = await strapi.entityService.findOne(
    'api::order.order',
    input.orderId,
    {
      populate: [
        'products',
        'classes',
        'services',
        'compositeProducts',
        'memberships',
        'products.tax',
        'classes.tax',
        'services.tax',
        'compositeProducts.tax',
        'memberships.tax',
        'memberships.taxCollection.taxes',
        'products.taxCollection.taxes',
        'classes.taxCollection.taxes',
        'services.taxCollection.taxes',
        'compositeProducts.taxCollection.taxes',
        'products.discounts',
        'products.discounts.applicableProducts',
        'products.discounts.excludedProducts',
        'classes.discounts',
        'classes.discounts.applicableClasses',
        'classes.discounts.excludedClasses',
        'services.discounts',
        'services.discounts.applicableServices',
        'services.discounts.excludedServices',
        'compositeProducts.discounts',
        'compositeProducts.discounts.applicableCompositeProducts',
        'compositeProducts.discounts.excludedCompositeProducts',
        'memberships.discounts',
        'memberships.discounts.applicableMemberships',
        'memberships.discounts.excludedMemberships',
        'contact',
        'company',
        'discounts',
        'discounts.applicableProducts',
        'discounts.applicableServices',
        'discounts.applicableClasses',
        'discounts.applicableCompositeProducts',
        'discounts.applicableMemberships',
        'discounts.excludedProducts',
        'discounts.excludedClasses',
        'discounts.excludedServices',
        'discounts.excludedCompositeProducts',
        'discounts.excludedMemberships',
      ],
    },
  );

  const points = order?.contact?.points || order?.company?.points || 0;
  const roundedInputPoints = roundPoints(input.points);

  if (roundedInputPoints > points + order.points) {
    throw new ApplicationError(
      'ApplicationError: Custom: This customer does not have enough points available.',
    );
  }

  if (roundedInputPoints > order.total + order.points) {
    throw new ApplicationError(
      "ApplicationError: Custom: The points you've entered exceed the total amount of your order. Please adjust.",
    );
  }

  if (order.company && order.company.points !== null) {
    await strapi.entityService.update(
      'api::company.company',
      order.company.id,
      {
        data: {
          points: roundPoints(
            order.company.points + order.points - roundedInputPoints,
          ),
        },
      },
    );
  }

  if (order.contact && order.contact.points !== null) {
    await strapi.entityService.update(
      'api::contact.contact',
      order.contact.id,
      {
        data: {
          points: roundPoints(
            order.contact.points + order.points - roundedInputPoints,
          ),
        },
      },
    );
  }

  const orderService = strapi.service('api::order.order');
  const { subTotal, totalTax, totalDiscount } =
    orderService.getOrderFullCalculations(order, roundedInputPoints);
  const currentOrderTotal = Number(
    (+subTotal + +totalTax - +totalDiscount - +roundedInputPoints).toFixed(2),
  );

  return await strapi.entityService.update('api::order.order', input.orderId, {
    data: {
      subTotal: +subTotal,
      total: currentOrderTotal,
      points: roundedInputPoints,
      tax: totalTax,
      discount: totalDiscount,
    },
  });
};
