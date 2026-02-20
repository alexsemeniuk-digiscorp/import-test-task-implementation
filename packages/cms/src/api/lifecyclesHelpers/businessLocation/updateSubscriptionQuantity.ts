import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../../graphql/constants';
import { LifecycleHook } from '../types';
import AfterLifecycleEvent = Database.AfterLifecycleEvent;

import { handleError, handleLogger } from '../../../graphql/helpers/errors';

export const updateSubscriptionQuantity: LifecycleHook = async ({
  result,
}: AfterLifecycleEvent) => {
  handleLogger(
    'info',
    'LifecycleHook :: BusinessLocation ::',
    `Params: ${JSON.stringify(result)}`,
  );
  handleLogger('info', 'STRIPE_SECRET_KEY', `${STRIPE_SECRET_KEY}`);

  try {
    const stripeInstance = new Stripe(STRIPE_SECRET_KEY);

    //business location with tenant
    const businessLocationWithTenant = await strapi.entityService.findOne(
      'api::business-location.business-location',
      result.id,
      {
        fields: ['id'],
        populate: {
          tenant: {
            fields: ['id'],
          },
        },
      },
    );

    //Find the tenant's active subscription
    const tenantActiveSubscription = await strapi.db
      .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
      .findOne({
        where: {
          tenant: businessLocationWithTenant.tenant.id,
          status: true,
        },
      });

    //Find all stores associated with the tenant
    const stores = await strapi.db
      .query('api::business-location.business-location')
      .count({
        where: {
          tenant: businessLocationWithTenant.tenant.id,
          type: 'store',
          archived: false,
        },
      });

    //Retrieve the stripe subscription
    const subscription = await stripeInstance.subscriptions.retrieve(
      tenantActiveSubscription.subscriptionId,
    );

    // Update the Stripe subscription with the new quantity
    await stripeInstance.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id, // Use the price ID from the tenant's subscription plan
          quantity: stores === 0 ? 1 : stores,
        },
      ],
    });
  } catch (error) {
    handleError('LifecycleHook :: BusinessLocation', '', `${error}`);
  }
};
