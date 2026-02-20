'use strict';

import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, getAbsoluteServerUrl } from '@strapi/utils';

import _ from 'lodash';

import { RoleType } from '../../../graphql/extensions/types';

const getProfile = async (provider, query) => {
  const { accessToken } = query;

  const providers = await strapi
    .store({ type: 'plugin', name: 'users-permissions', key: 'grant' })
    .get();

  return getService('providers-registry').run({
    provider,
    query,
    accessToken,
    providers,
  });
};

export default {
  connect: async (
    provider: string,
    query: { accessToken: string; tenantSlug?: string },
  ) => {
    const { accessToken, tenantSlug } = query;

    if (!accessToken) {
      throw new Error('No access_token.');
    }

    // Get the profile.
    const profile = await getProfile(provider, query);

    const email = _.toLower(profile.email);

    // We need at least the mail.
    if (!email) {
      throw new Error('Email was not available.');
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email: email.toLowerCase() },
    });

    if (!_.isEmpty(user)) {
      return user;
    }

    const advancedSettings = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
      .get();

    if (_.isEmpty(user) && !advancedSettings.allow_register) {
      throw new Error('Register action is actually not available.');
    }

    const role = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: tenantSlug ? RoleType.AUTHENTICATED : RoleType.OWNER },
    });

    if (!role) {
      throw new errors.ApplicationError('Impossible to find the default role');
    }

    // Create the new user.
    const newUser = {
      ...profile,
      email,
      provider,
      role: role.id,
      confirmed: true,
    };

    return strapi
      .query('plugin::users-permissions.user')
      .create({ data: newUser });
  },

  buildRedirectUri: (provider = '') => {
    const apiPrefix = strapi.config.get('api.rest.prefix');

    return `${getAbsoluteServerUrl(
      strapi.config,
    )}${apiPrefix}/connect/${provider}/callback`;
  },
};
