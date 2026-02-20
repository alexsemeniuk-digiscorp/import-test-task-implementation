import { GraphQLFieldResolver } from 'graphql';
import Stripe from 'stripe';
import { ServiceCharge, UsageType } from '../usage.types';

interface TenantCreditHistory {
  amount: number;
  tenant: number;
  status: 'completed' | 'paid' | 'failed';
  date: Date;
  transactionType: 'credit' | 'debit';
  serviceType?: UsageType;
  stripeInfo?: {
    paymentIntentId: string;
  };
  invoice?: string;
}

async function processStripePayment(
  stripeInstance: Stripe,
  customerId: string,
  paymentMethodId: string,
  amount: number,
): Promise<{
  success: boolean;
  paymentIntent?: Stripe.PaymentIntent;
  charge?: Stripe.Charge;
}> {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      off_session: true,
      return_url: `${process.env.FRONTEND_URL}`,
    });

    if (paymentIntent.status !== 'succeeded') {
      return { success: false };
    }

    const charge = await stripeInstance.charges.retrieve(
      paymentIntent.latest_charge as string,
    );
    return { success: true, paymentIntent, charge };
  } catch (error) {
    return { success: false };
  }
}

async function updateTenantCredits(
  tenantId: number,
  amount: number,
  type: 'add' | 'deduct',
): Promise<number> {
  const tenant = await strapi.db.query('api::tenant.tenant').findOne({
    where: { id: tenantId },
  });

  const newBalance =
    type === 'add' ? tenant.credits + amount : tenant.credits - amount;

  await strapi.db.query('api::tenant.tenant').update({
    where: { id: tenantId },
    data: { credits: newBalance },
  });

  return newBalance;
}

async function logCreditHistory(data: TenantCreditHistory): Promise<void> {
  await strapi.db
    .query('api::tenant-credit-history.tenant-credit-history')
    .create({
      data,
    });
}

async function handleAutoRecharge(
  userDetail: any,
  stripeInstance: Stripe,
  serviceUsageCost: number,
): Promise<boolean> {
  if (
    !userDetail.tenant.autoRechargeCredit ||
    userDetail.tenant.thresholdBalance < userDetail.tenant.credits
  ) {
    return false;
  }

  const customers = await stripeInstance.customers.list({
    email: userDetail.email,
  });
  if (!customers.data.length) return false;

  const customer = await stripeInstance.customers.retrieve(
    customers.data[0].id,
  );
  if (
    !('invoice_settings' in customer) ||
    !customer.invoice_settings?.default_payment_method
  ) {
    return false;
  }

  const { success, paymentIntent, charge } = await processStripePayment(
    stripeInstance,
    customer.id,
    customer.invoice_settings.default_payment_method as string,
    userDetail.tenant.rechargeToBalance,
  );

  if (!success || !paymentIntent || !charge) return false;

  await updateTenantCredits(
    userDetail.tenant.id,
    userDetail.tenant.rechargeToBalance,
    'add',
  );

  await logCreditHistory({
    amount: userDetail.tenant.rechargeToBalance,
    tenant: userDetail.tenant.id,
    status: 'completed',
    date: new Date(),
    transactionType: 'credit',
    stripeInfo: {
      paymentIntentId: paymentIntent.id,
    },
    invoice: charge.receipt_url,
  });

  return true;
}

async function handleDirectPayment(
  userDetail: any,
  stripeInstance: Stripe,
  amount: number,
  serviceType: UsageType,
): Promise<boolean> {
  const customers = await stripeInstance.customers.list({
    email: userDetail.email,
  });
  if (!customers.data.length) return false;

  const customer = await stripeInstance.customers.retrieve(
    customers.data[0].id,
  );
  if (
    !('invoice_settings' in customer) ||
    !customer.invoice_settings?.default_payment_method
  ) {
    return false;
  }

  const { success, paymentIntent, charge } = await processStripePayment(
    stripeInstance,
    customer.id,
    customer.invoice_settings.default_payment_method as string,
    amount,
  );

  if (!success || !paymentIntent || !charge) return false;

  await updateTenantCredits(userDetail.tenant.id, amount, 'add');
  await logCreditHistory({
    amount: amount,
    tenant: userDetail.tenant.id,
    status: 'completed',
    date: new Date(),
    transactionType: 'credit',
    stripeInfo: {
      paymentIntentId: paymentIntent.id,
    },
    invoice: charge.receipt_url,
    serviceType: serviceType,
  });

  return true;
}

async function calculateUsageCounts(
  userDetail: any,
  serviceType: UsageType,
  newStorageUsage?: number,
): Promise<Record<string, number>> {
  const usageCounts = {};

  switch (serviceType) {
    case 'userCount': {
      const count = await strapi.query('plugin::users-permissions.user').count({
        where: {
          tenant: userDetail.tenant.id,
          confirmed: true,
          blocked: false,
          role: {
            name: {
              $notIn: ['Public', 'Customer'],
            },
          },
        },
        populate: ['tenant', 'role'],
      });
      usageCounts[serviceType] = count + 1;
      break;
    }
    case 'inventoryItemCount': {
      const count = await strapi.query('api::product.product').count({
        where: { tenant: userDetail.tenant.id },
        populate: ['tenant'],
      });
      usageCounts[serviceType] = count + 1;
      break;
    }
    case 'storage': {
      const tenantStorageUsage = await strapi.db
        .query('api::tenant.tenant')
        .findOne({
          where: { id: userDetail.tenant.id },
          select: ['storageUsage'],
        });

      // Convert storage usage from KB to MB and round up
      const storageUsageInMB = Math.ceil(
        tenantStorageUsage.storageUsage / 1024,
      );
      usageCounts[serviceType] = storageUsageInMB;
      break;
    }
    case 'smsReceiveCount':
    case 'smsSendCount':
    case 'mmsReceiveCount':
    case 'mmsSendCount':
    case 'callTime':
    case 'callRecordingTime':
    case 'transcriptionTime':
      // Initialize with the provided usage amount
      usageCounts[serviceType] = newStorageUsage || 1;
      break;
    default:
      usageCounts[serviceType] = 1;
  }

  return usageCounts;
}

export const updateUsageCounts: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  {
    input: {
      serviceType: UsageType;
      serviceCharge: ServiceCharge;
      newStorageUsage?: any;
    };
  }
> = async (root, { input }, ctx) => {
  try {
    const userService = await strapi
      .plugin('users-permissions')
      .service('user');
    const userDetail = await userService.fetch(ctx.state.user.id, {
      populate: ['tenant'],
    });

    const currentData = new Date();
    const oneMonth = new Date();
    oneMonth.setMonth(currentData.getMonth() - 1);

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '');

    // Get subscription and usage details
    const [usage, subscriptionPlan] = await Promise.all([
      strapi.db.query('api::usage.usage').findOne({
        where: {
          tenant: userDetail.tenant.id,
          currentMonth: {
            $gte: oneMonth.toISOString(),
            $lte: currentData.toISOString(),
          },
        },
      }),
      strapi.db
        .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
        .findOne({
          where: {
            tenant: userDetail.tenant.id,
            status: true,
          },
          populate: ['plan'],
        }),
    ]);

    if (!subscriptionPlan || !subscriptionPlan.plan) {
      throw new Error('No active subscription plan found');
    }

    let serviceUsageCost = subscriptionPlan.plan[input.serviceCharge];
    const serviceFreeLimit = subscriptionPlan.plan[input.serviceType] || 0;
    const currentUsageCount = usage?.usageCounts[input.serviceType] ?? 0;

    if (input?.serviceType === 'storage') {
      // Convert newStorageUsage from KB to MB and round up
      const newStorageUsageInMB = Math.ceil(
        (input?.newStorageUsage || 0) / 1024,
      );
      serviceUsageCost =
        newStorageUsageInMB * subscriptionPlan.plan[input.serviceCharge];
    }

    if (
      input?.serviceType === 'smsReceiveCount' ||
      input?.serviceType === 'smsSendCount' ||
      input?.serviceType === 'mmsReceiveCount' ||
      input?.serviceType === 'mmsSendCount' ||
      input?.serviceType === 'callTime' ||
      input?.serviceType === 'callRecordingTime' ||
      input?.serviceType === 'transcriptionTime'
    ) {
      serviceUsageCost =
        (input?.newStorageUsage || 0) *
        subscriptionPlan.plan[input.serviceCharge];
    }

    // Check if current usage exceeds free limit
    const isWithinFreeLimit = currentUsageCount < serviceFreeLimit;

    // Only process payment if beyond free limit
    if (!isWithinFreeLimit && serviceUsageCost > 0) {
      // Step 1: Check initial credit balance and try auto-recharge if enabled
      if (userDetail.tenant.credits < serviceUsageCost) {
        const rechargeSuccess = await handleAutoRecharge(
          userDetail,
          stripeInstance,
          serviceUsageCost,
        );

        // Step 2: If auto-recharge fails, try direct payment
        if (!rechargeSuccess) {
          const directPaymentSuccess = await handleDirectPayment(
            userDetail,
            stripeInstance,
            serviceUsageCost,
            input.serviceType,
          );

          // Step 3: If both payment methods fail, throw error
          if (!directPaymentSuccess) {
            throw new Error(
              'Insufficient credits and all payment methods failed',
            );
          }
        }
      }

      // Verify final balance after all payment attempts
      const updatedTenant = await strapi.db
        .query('api::tenant.tenant')
        .findOne({
          where: { id: userDetail.tenant.id },
        });

      if (updatedTenant.credits < serviceUsageCost) {
        throw new Error('Insufficient credits after payment attempts');
      }
    }

    if (usage) {
      // Merge existing usageCounts with the new count

      // Convert newStorageUsage from KB to MB and round up to the nearest MB
      const newStorageUsageInMB = Math.ceil(
        (input?.newStorageUsage || 0) / 1024,
      );

      const updatedUsageCounts = {
        ...usage.usageCounts,
        [input.serviceType]:
          input.serviceType === 'storage'
            ? parseFloat(usage.usageCounts[input.serviceType] || 0) +
              newStorageUsageInMB
            : (usage.usageCounts[input.serviceType] || 0) +
              (input.newStorageUsage || 1),
      };

      await strapi.db.query('api::usage.usage').update({
        where: { tenant: userDetail.tenant.id },
        data: {
          usageCounts: updatedUsageCounts,
        },
      });

      // Only deduct credits if beyond free limit and cost exists
      if (!isWithinFreeLimit && serviceUsageCost > 0) {
        await updateTenantCredits(
          userDetail.tenant.id,
          serviceUsageCost,
          'deduct',
        );
        await logCreditHistory({
          amount: serviceUsageCost,
          serviceType: input.serviceType,
          date: new Date(),
          status: 'paid',
          tenant: userDetail.tenant.id,
          transactionType: 'debit',
        });
      }
    } else {
      // Create new usage record
      const usageCounts = await calculateUsageCounts(
        userDetail,
        input.serviceType,
        input?.newStorageUsage,
      );
      await strapi.db.query('api::usage.usage').create({
        data: {
          tenant: userDetail.tenant.id,
          usageCounts,
          currentMonth: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    console.log('get error on updateUsageCounts', error);
    throw new Error(error.message);
  }
};
