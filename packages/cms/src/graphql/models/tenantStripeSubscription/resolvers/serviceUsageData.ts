import { GraphQLFieldResolver } from 'graphql';
const excludedRoles = ['Customer', 'Public'];

export const serviceUsageData: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  null
> = async (root, args, ctx) => {
  try {
    const userService = await strapi
      .plugin('users-permissions')
      .service('user');
    const userDetail = await userService.fetch(ctx.state.user.id, {
      populate: ['tenant'],
    });

    const tenant = await strapi.entityService.findOne(
      'api::tenant.tenant',
      userDetail?.tenant?.id,
      {
        populate: ['usages'],
      },
    );

    if (!userDetail) {
      throw new Error('User not found');
    }

    const currentData = new Date();
    const oneMonth = new Date();
    oneMonth.setMonth(currentData.getMonth() - 1);

    const employeeCount = await strapi
      .query('plugin::users-permissions.user')
      .count({
        where: {
          tenant: userDetail.tenant.id,
          confirmed: true,
          blocked: false,
          role: { name: { $notIn: excludedRoles } },
        },
        populate: ['tenant', 'role'],
      });

    const subscribedPlan = await strapi.db
      .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
      .findOne({
        where: {
          tenant: userDetail.tenant.id,
          status: true,
        },
        populate: ['plan'],
      });

    if (!subscribedPlan) {
      throw new Error('No active plan found');
    }

    const productCount = await strapi.query('api::product.product').count({
      where: { tenant: userDetail.tenant.id },
      populate: ['tenant'],
    });

    const serviceUsageData = await strapi.db.query('api::usage.usage').findOne({
      where: {
        tenant: userDetail.tenant.id,
        currentMonth: {
          $gte: oneMonth.toISOString(),
          $lte: currentData.toISOString(),
        },
      },
    });

    const monthlySMS =
      (Number(serviceUsageData?.usageCounts?.smsSendCount) || 0) +
      (Number(serviceUsageData?.usageCounts?.smsReceiveCount) || 0);
    const monthlyMMS =
      (Number(serviceUsageData?.usageCounts?.mmsSendCount) || 0) +
      (Number(serviceUsageData?.usageCounts?.mmsReceiveCount) || 0);

    const storageUsage = tenant?.storageUsage
      ? parseFloat(tenant.storageUsage)
      : 0;

    //Todo (Valentyn) - update this object usage counts on monthly basis
    const usageCount = {
      users: employeeCount,
      monthlySMS: monthlySMS,
      monthlyMMS: monthlyMMS,
      monthlyEmail: serviceUsageData?.usageCounts?.monthlyEmailCount ?? 0,
      storage: (storageUsage / 1024).toFixed(2) ?? 0,
      callTime: serviceUsageData?.usageCounts?.callTime ?? 0,
      inventoryItem: productCount,
      callRecordingTime: serviceUsageData?.usageCounts?.callRecordingTime ?? 0,
      transcriptionTime: serviceUsageData?.usageCounts?.transcriptionTime ?? 0,
      smsReceiveCount: serviceUsageData?.usageCounts?.smsReceiveCount ?? 0,
      smsSendCount: serviceUsageData?.usageCounts?.smsSendCount ?? 0,
      mmsReceiveCount: serviceUsageData?.usageCounts?.mmsReceiveCount ?? 0,
      mmsSendCount: serviceUsageData?.usageCounts?.mmsSendCount ?? 0,
      giaApiCount: 0,
      igiApiCount: 0,
    };

    // Define the usage limits based on the subscribed plan
    const usageLimit = {
      users: subscribedPlan.plan.userCount ?? 0,
      monthlySMS:
        (Number(subscribedPlan.plan.smsReceiveCount) || 0) +
        (Number(subscribedPlan.plan.smsSendCount) || 0),
      monthlyMMS:
        (Number(subscribedPlan.plan.mmsReceiveCount) || 0) +
        (Number(subscribedPlan.plan.mmsSendCount) || 0),
      monthlyEmail: subscribedPlan.plan.monthlyEmailCount ?? 0,
      storage: subscribedPlan.plan.storage ?? 0,
      callTime: subscribedPlan.plan.callTime ?? 0,
      inventoryItem: subscribedPlan.plan.inventoryItemCount ?? 0,
      callRecordingTime: subscribedPlan.plan.callRecordingTime ?? 0,
      transcriptionTime: subscribedPlan.plan.transcriptionTime ?? 0,
      smsReceiveCount: subscribedPlan.plan.smsReceiveCount ?? 0,
      smsSendCount: subscribedPlan.plan.smsSendCount ?? 0,
      mmsReceiveCount: subscribedPlan.plan.mmsReceiveCount ?? 0,
      mmsSendCount: subscribedPlan.plan.mmsSendCount ?? 0,
      giaApiCount: subscribedPlan.plan.giaApiCount ?? 0,
      igiApiCount: subscribedPlan.plan.igiApiCount ?? 0,
    };
    return {
      usageLimit,
      usageCount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
