import { handleError } from '../../../../graphql/helpers/errors';

export const addTenantToPlan = async (tenantId) => {
  try {
    const subscriptionPlans = await strapi.db
      .query('api::stripe-subscription-plan.stripe-subscription-plan')
      .findMany({
        where: { subscriptionVisibleType: 'all' },
        populate: ['whichTenantCanSee'],
      });

    if (subscriptionPlans.length > 0) {
      subscriptionPlans.forEach(async (plan) => {
        await strapi.db
          .query('api::stripe-subscription-plan.stripe-subscription-plan')
          .update({
            where: { id: plan.id },
            data: { whichTenantCanSee: [...plan.whichTenantCanSee, tenantId] },
          });
      });
    }
  } catch (e) {
    handleError('addTenantToPlan', undefined, e);
  }
};
