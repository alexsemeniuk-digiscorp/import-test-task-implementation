import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import dayjs from 'dayjs';
import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { dollarsToCents } from '../../order/helpers/helper';

/**
 * Increments the user count in the usage record for a tenant
 * When unblocking, we always want to increment the user count
 */
async function incrementUserCount(tenantId: number | string): Promise<void> {
  const currentDate = new Date();
  const oneMonth = new Date();
  oneMonth.setMonth(currentDate.getMonth() - 1);

  // Find current month's usage record
  const usage = await strapi.db.query('api::usage.usage').findOne({
    where: {
      tenant: tenantId,
      currentMonth: {
        $gte: oneMonth.toISOString(),
        $lte: currentDate.toISOString(),
      },
    },
  });

  if (usage) {
    // Always increment the userCount by 1 for unblocking
    const newUserCount = usage.usageCounts.userCount + 1;

    await strapi.db.query('api::usage.usage').update({
      where: { id: usage.id },
      data: {
        usageCounts: {
          ...usage.usageCounts,
          userCount: newUserCount,
        },
      },
    });
  } else {
    // If no usage record exists, create a new one with count 1
    await strapi.db.query('api::usage.usage').create({
      data: {
        tenant: tenantId,
        currentMonth: currentDate,
        usageCounts: {
          userCount: 1,
        },
      },
    });
  }
}

export const unblockEmployee: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: { id: ID } }
> = async (root, args, ctx) => {
  try {
    const { id } = args.input;

    const userData = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      id,
      {
        populate: ['role', 'tenant'],
      },
    );

    if (!userData) {
      throw new Error('User not found');
    }

    // Get subscription plan data
    const subscriptionPlanData = await strapi.db
      .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
      .findOne({
        where: {
          tenant: userData.tenant.id,
          status: true,
        },
        populate: ['plan'],
      });

    if (!subscriptionPlanData) {
      throw new Error('No active subscription plan found for tenant');
    }

    // Get the free user limit from the plan
    const serviceFreeLimit =
      Number(subscriptionPlanData.plan['userCount']) || 0;
    const serviceUsageCost = Number(subscriptionPlanData.plan['userCharge']);

    // Count current active users (excluding the one we're unblocking)
    const currentActiveUsers = await strapi
      .query('plugin::users-permissions.user')
      .count({
        where: {
          tenant: userData.tenant.id,
          confirmed: true,
          blocked: false,
          role: {
            name: {
              $notIn: ['Public', 'Customer'],
            },
          },
        },
      });

    // Check if unblocking this user would exceed the limit
    const willExceedLimit = currentActiveUsers + 1 > serviceFreeLimit;

    // Get info if user is already in exceeded service
    const exceededMemberData = await strapi.db
      .query('api::exceeded-service.exceeded-service')
      .findOne({
        where: {
          employee: id,
          tenant: userData.tenant.id,
        },
      });

    // If we're within limits, just unblock the user without charging
    if (!willExceedLimit) {
      // Unblock the user
      await strapi.entityService.update('plugin::users-permissions.user', id, {
        data: {
          blocked: false,
        },
      });

      // Always increment the user count when unblocking
      await incrementUserCount(userData.tenant.id);

      // If user was previously in exceeded-service, remove them
      if (exceededMemberData) {
        await strapi.db.query('api::exceeded-service.exceeded-service').delete({
          where: { id: exceededMemberData.id },
        });
      }

      return true;
    }

    // If we reach here, we exceed limits and need to charge
    if (serviceUsageCost > 0) {
      if (userData.tenant.credits >= serviceUsageCost) {
        // If we have enough credits, deduct them and unblock
        await strapi.db.query('api::tenant.tenant').update({
          where: { id: userData.tenant.id },
          data: { credits: userData.tenant.credits - serviceUsageCost },
        });

        await strapi.db
          .query('api::tenant-credit-history.tenant-credit-history')
          .create({
            data: {
              amount: serviceUsageCost,
              tenant: userData.tenant.id,
              status: 'completed',
              date: new Date(),
              transactionType: 'debit',
              serviceType: 'userCount',
            },
          });

        // Unblock the user
        await strapi.entityService.update(
          'plugin::users-permissions.user',
          id,
          {
            data: {
              blocked: false,
            },
          },
        );

        // Always increment the user count when unblocking
        await incrementUserCount(userData.tenant.id);

        // Add to exceeded-service if not already there
        if (!exceededMemberData) {
          await strapi.db
            .query('api::exceeded-service.exceeded-service')
            .create({
              data: {
                employee: id,
                tenant: userData.tenant.id,
                nextBillingCycle: dayjs().add(1, 'month').format('YYYY-MM-DD'),
              },
            });
        }
      } else {
        // If we don't have enough credits, try Stripe payment
        const getUsersByTenantId = await strapi.db
          .query('api::tenant.tenant')
          .findOne({
            where: { id: userData.tenant.id },
            populate: ['users', 'users.role'],
          });

        // Find tenant owner user (with better error handling)
        const ownerUser =
          getUsersByTenantId.users.find(
            (user: any) => user.role?.type === 'owner',
          ) || getUsersByTenantId.users[0]; // Fallback to first user if owner not found

        if (!ownerUser) {
          throw new Error('Could not find owner user for the tenant');
        }

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '');

        const existingCustomers = await stripeInstance.customers.list({
          email: ownerUser.email,
        });

        if (!existingCustomers.data.length) {
          throw new Error('No Stripe customer found for tenant owner');
        }

        const customer = await stripeInstance.customers.retrieve(
          existingCustomers.data[0].id,
        );

        if (
          !('invoice_settings' in customer) ||
          !customer.invoice_settings?.default_payment_method
        ) {
          throw new Error('No default payment method found for customer');
        }

        const defaultPaymentMethodId =
          customer.invoice_settings.default_payment_method;

        // Make payment via Stripe
        const paymentIntent = await stripeInstance.paymentIntents.create({
          amount: dollarsToCents(serviceUsageCost),
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
          customer: existingCustomers.data[0].id,
          payment_method: defaultPaymentMethodId as string,
          return_url: `${process.env.FRONTEND_URL}`,
          off_session: true,
          confirm: true,
        });

        if (paymentIntent.status === 'succeeded') {
          // Update tenant credits and create history records
          const tenantCurrentBalance = await strapi.db
            .query('api::tenant.tenant')
            .findOne({
              where: {
                id: userData.tenant.id,
              },
            });

          await strapi.db.query('api::tenant.tenant').update({
            where: {
              id: userData.tenant.id,
            },
            data: {
              credits: tenantCurrentBalance.credits + serviceUsageCost,
            },
          });

          // Log the credit transaction
          await strapi.db
            .query('api::tenant-credit-history.tenant-credit-history')
            .create({
              data: {
                amount: serviceUsageCost,
                tenant: userData.tenant.id,
                status: 'completed',
                date: new Date(),
                transactionType: 'credit',
                serviceType: 'userCount',
                stripeInfo: {
                  paymentIntentId: paymentIntent.id,
                },
              },
            });

          // Deduct the service cost
          await strapi.db.query('api::tenant.tenant').update({
            where: {
              id: userData.tenant.id,
            },
            data: {
              credits: tenantCurrentBalance.credits,
            },
          });

          // Log the debit transaction
          await strapi.db
            .query('api::tenant-credit-history.tenant-credit-history')
            .create({
              data: {
                amount: serviceUsageCost,
                tenant: userData.tenant.id,
                status: 'completed',
                date: new Date(),
                transactionType: 'debit',
                serviceType: 'userCount',
              },
            });

          // Finally unblock the user
          await strapi.entityService.update(
            'plugin::users-permissions.user',
            id,
            {
              data: {
                blocked: false,
              },
            },
          );

          // Always increment the user count when unblocking
          await incrementUserCount(userData.tenant.id);

          // Add to exceeded-service if not already there
          if (!exceededMemberData) {
            await strapi.db
              .query('api::exceeded-service.exceeded-service')
              .create({
                data: {
                  employee: id,
                  tenant: userData.tenant.id,
                  nextBillingCycle: dayjs()
                    .add(1, 'month')
                    .format('YYYY-MM-DD'),
                },
              });
          }
        } else {
          throw new Error('Error while making payment');
        }
      }
    } else {
      // If service usage cost is 0, just unblock without charging
      await strapi.entityService.update('plugin::users-permissions.user', id, {
        data: {
          blocked: false,
        },
      });

      // Always increment the user count when unblocking
      await incrementUserCount(userData.tenant.id);
    }

    return true;
  } catch (error) {
    throw new Error(error.message || 'Error while unblocking employee');
  }
};
