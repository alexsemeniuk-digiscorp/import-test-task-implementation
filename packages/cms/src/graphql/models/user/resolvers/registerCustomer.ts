import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, sanitize } from '@strapi/utils';

import { GraphQLFieldResolver } from 'graphql';
import _ from 'lodash';
import { toPlainObject } from 'lodash/fp';

import { CustomerUserRegisterInput } from '../user.types';

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

export const registerCustomer: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: CustomerUserRegisterInput }
> = async (root, args, ctx) => {
  const {
    password,
    tenantSlug,
    websiteId,
    firstName,
    lastName,
    phoneNumber,
    ...params
  } = args.input;

  const pluginStore = await strapi.store({
    type: 'plugin',
    name: 'users-permissions',
  });

  const settings = await pluginStore.get({ key: 'advanced' });

  if (!settings.allow_register) {
    throw new Error('Register action is currently disabled');
  }

  const role = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: settings.default_role },
  });

  if (!role) {
    throw new errors.ApplicationError('Impossible to find the default role');
  }

  const tenant = await strapi.entityService
    .findMany('api::tenant.tenant', {
      filters: {
        slug: tenantSlug,
      },
    })
    .then((tenants) => tenants[0]);

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
    websiteId,
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
    username,
    password,
    role: role.id,
    email: email.toLowerCase(),
    confirmed: !settings.email_confirmation,
  };

  const user = await getService('user').add(newUser);

  const leads = await strapi.entityService.findMany('api::lead.lead', {
    filters: {
      email,
    },
  });
  if (!leads.length) {
    const newLead = await strapi.entityService.create('api::lead.lead', {
      data: {
        email: email,
        fullName: firstName + ' ' + lastName,
        phoneNumber,
        tenant: tenant.id,
        leadSource: 'online store',
      },
    });

    await getService('user').edit(user.id, { lead: newLead.id });
  } else {
    await strapi.entityService.update('api::lead.lead', leads[0].id, {
      data: {
        fullName: firstName + ' ' + lastName,
        phoneNumber,
      },
    });
    await getService('user').edit(user.id, { lead: leads[0].id });
  }
  const sanitizedUser = await sanitizeUser(user, ctx);

  if (settings.email_confirmation) {
    try {
      const { koaContext } = ctx;

      koaContext.request.body = toPlainObject(normalizedParams);

      await strapi
        .plugin('users-permissions')
        .controller('auth')
        .sendCustomerEmailConfirmation(koaContext);
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
