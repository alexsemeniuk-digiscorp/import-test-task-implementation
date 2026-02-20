import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, sanitize } from '@strapi/utils';
import dayjs from 'dayjs';

import { GraphQLFieldResolver } from 'graphql';
import _ from 'lodash';
import { toPlainObject } from 'lodash/fp';

import { generatePassword } from '../../../../utils/randomBytes';
import { updateUsageCounts } from '../../usage/resolvers/updateUsageCounts';
import { UserRegisterInput } from '../user.types';

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

export const addEmployee: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: UserRegisterInput }
> = async (root, args, ctx, info) => {
  try {
    const { referralCode, role, ...params } = args.input;
    const hr = ctx.state.user.id;

    const pluginStore = await strapi.store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new Error('Register action is currently disabled');
    }

    const owner = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      hr,
      {
        populate: { tenant: true },
      },
    );

    const tenant = await strapi.entityService.findOne(
      'api::tenant.tenant',
      owner.tenant.id,
    );

    const subscriptionPlan = await strapi.db
      .query('api::tenant-stripe-subscription.tenant-stripe-subscription')
      .findOne({
        where: { tenant: tenant.id, status: true },
        populate: ['plan'],
      });

    if (!subscriptionPlan) {
      throw new Error('No active subscription plan found');
    }

    // Check if the employee count exceeds the plan limit
    // Get current usage for this month
    const currentData = new Date();
    const oneMonth = new Date();
    oneMonth.setMonth(currentData.getMonth() - 1);

    const currentUsage = await strapi.db.query('api::usage.usage').findOne({
      where: {
        tenant: tenant.id,
        currentMonth: {
          $gte: oneMonth.toISOString(),
          $lte: currentData.toISOString(),
        },
      },
    });

    const currentUserCount = currentUsage?.usageCounts?.userCount ?? 0;
    const planUserLimit = subscriptionPlan.plan.users || 0;

    // Check if adding this employee would exceed the plan limit
    const exceedMember = currentUserCount >= planUserLimit;

    const normalizedParams = {
      ..._.omit(params, [
        'confirmed',
        'blocked',
        'confirmationToken',
        'resetPasswordToken',
        'provider',
        'id',
        'createdAt',
        'updatedAt',
        'createdBy',
        'updatedBy',
      ]),
      provider: 'local',
      password: generatePassword(),
      newEmployee: true,
      tenant: tenant.id,
      tenantName: tenant.companyName,
    };

    const { email, username } = normalizedParams;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    if (settings.unique_email) {
      const conflictingUserCount = await strapi
        .query('plugin::users-permissions.user')
        .count({
          where: { ...identifierFilter },
        });

      if (conflictingUserCount > 0) {
        throw new Error('Email is already taken');
      }
    }

    const newUser = {
      ...normalizedParams,
      role: role,
      email: email.toLowerCase(),
      username,
      confirmed: !settings.email_confirmation,
    };

    // Attempt to update usage counts
    const updateUsage = await updateUsageCounts(
      null,
      { input: { serviceType: 'userCount', serviceCharge: 'userCharge' } },
      ctx,
      info,
    );

    if (!updateUsage) {
      throw new Error('Usage update failed');
    }

    const user = await getService('user').add(newUser);

    await strapi.entityService.create('api::onboarding-user.onboarding-user', {
      data: {
        user: user.id,
        isCompleted: false,
        tenant: tenant.id,
      },
    });
    if (exceedMember) {
      await strapi.entityService.create(
        'api::exceeded-service.exceeded-service',
        {
          data: {
            employee: user.id,
            nextBillingCycle: dayjs().add(30, 'days').toDate(),
            tenant: tenant.id,
          },
        },
      );
    }

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        const { koaContext } = ctx;
        koaContext.request.body = toPlainObject(normalizedParams);

        await strapi
          .plugin('users-permissions')
          .controller('auth')
          .sendEmailConfirmation(koaContext);
      } catch (err) {
        throw new errors.ApplicationError(err.message);
      }
    }

    const jwt = getService('jwt').issue(_.pick(user, ['id']));

    // Return the user, jwt, and exceedMember status in the response
    return {
      user: sanitizedUser,
      jwt: jwt,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
