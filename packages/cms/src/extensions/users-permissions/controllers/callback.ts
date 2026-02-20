import { validateCallbackBody } from '@strapi/plugin-users-permissions/server/controllers/validation/auth';
import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, sanitize } from '@strapi/utils';
import _ from 'lodash';
import { createSessionWithToken } from '../../../graphql/helpers/createSessionWithToken';

const { ApplicationError, ValidationError, ForbiddenError } = errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};
export const callback = async (ctx) => {
  const provider = ctx.params.provider || 'local';
  const params = ctx.request.body;
  const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const grantSettings = await store.get({ key: 'grant' });

  const grantProvider = provider === 'local' ? 'email' : provider;

  if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
    throw new ApplicationError('This provider is disabled');
  }

  if (provider === 'local') {
    await validateCallbackBody(params);

    const { identifier } = params;

    // Check if the user exists.
    const user = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: {
          provider,
          $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        },
      });

    if (!user) {
      throw new ValidationError('Invalid identifier or password');
    }

    if (!user.password) {
      throw new ValidationError('Invalid identifier or password');
    }

    const validPassword = await getService('user').validatePassword(
      params.password,
      user.password,
    );

    if (!validPassword) {
      throw new ValidationError('Invalid identifier or password');
    }

    const advancedSettings = await store.get({ key: 'advanced' });
    const requiresConfirmation = _.get(advancedSettings, 'email_confirmation');

    if (requiresConfirmation && user.confirmed !== true) {
      throw new ApplicationError('Your account email is not confirmed');
    }

    if (user.blocked === true) {
      throw new ApplicationError(
        'Your account has been blocked by an administrator',
      );
    }

    const token = await createSessionWithToken(
      user.id,
      ctx.request.ip,
      ctx.request.headers['user-agent'],
    );

    ctx.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age
      domain:
        process.env.NODE_ENV === 'development'
          ? '.localhost'
          : process.env.FRONTEND_DOMAIN,
      sameSite: 'Strict',
    });

    return ctx.send({
      status: 'Authenticated',
      user: await sanitizeUser(user, ctx),
    });
  }

  // Connect the user with the third-party provider.
  try {
    const user = await getService('providers').connect(provider, ctx.query);

    if (user.blocked) {
      throw new ForbiddenError(
        'Your account has been blocked by an administrator',
      );
    }
    return ctx.send({
      user: await sanitizeUser(user, ctx),
    });
  } catch (error) {
    throw new ApplicationError(error.message);
  }
};
