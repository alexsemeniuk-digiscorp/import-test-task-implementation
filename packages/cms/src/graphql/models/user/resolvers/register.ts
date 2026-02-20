import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, sanitize } from '@strapi/utils';

import { GraphQLFieldResolver } from 'graphql';
import _ from 'lodash';
import { toPlainObject } from 'lodash/fp';

import { RoleType } from '../../../extensions/types';

import { UserRegisterInput } from '../user.types';

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

export const register: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: UserRegisterInput }
> = async (__, args, ctx) => {
  const { companyName, tenantSlug, referralCode, ...params } = args.input;

  const pluginStore = await strapi.store({
    type: 'plugin',
    name: 'users-permissions',
  });

  const settings = await pluginStore.get({ key: 'advanced' });

  if (!settings.allow_register) {
    throw new Error('Register action is currently disabled');
  }

  const role = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: !tenantSlug ? RoleType.OWNER : settings.default_role },
  });

  if (!role) {
    throw new errors.ApplicationError('Impossible to find the default role');
  }

  let tenant = null;

  if (!tenantSlug && companyName) {
    try {
      tenant = await strapi.entityService.create('api::tenant.tenant', {
        data: {
          companyName,
        },
      });
    } catch (err) {
      throw new Error(
        'This company name is already taken, please choose another one',
      );
    }
  } else if (tenantSlug) {
    tenant = await strapi.entityService
      .findMany('api::tenant.tenant', {
        filters: {
          slug: tenantSlug,
        },
      })
      .then((tenants) => tenants[0]);
  }

  if (!tenant) {
    throw new Error('Company not found');
  }

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
      'role',
    ]),
    provider: 'local',
    tenant: tenant?.id,
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
      throw new Error('This email is already taken');
    }
  }

  const newUser = {
    ...normalizedParams,
    role: role.id,
    email: email.toLowerCase(),
    username,
    confirmed: !settings.email_confirmation,
  };

  const user = await getService('user').add(newUser);

  if (user?.id) {
    await strapi?.entityService?.create(
      'api::reports-schedule.reports-schedule',
      {
        data: {
          user: user?.id,
        },
      },
    );

    await strapi?.entityService?.create(
      'api::localization-setting.localization-setting',
      {
        data: {
          user: user?.id,
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

  return {
    user: sanitizedUser,
    jwt: jwt,
  };
};
