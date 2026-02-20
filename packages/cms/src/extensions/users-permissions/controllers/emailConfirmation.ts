import { validateEmailConfirmationBody } from '@strapi/plugin-users-permissions/server/controllers/validation/auth';
import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, sanitize } from '@strapi/utils';
import { createSessionWithToken } from '../../../graphql/helpers/createSessionWithToken';

const { ValidationError } = errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

export const emailConfirmation = async (ctx, next, returnUser) => {
  const { confirmation: confirmationToken } =
    await validateEmailConfirmationBody(ctx.query);
  const userService = getService('user');
  const jwtService = getService('jwt');

  const [user] = await userService.fetchAll({ filters: { confirmationToken } });

  if (!user) {
    throw new ValidationError('Invalid token');
  }

  await userService.edit(user.id, { confirmed: true, confirmationToken: null });

  if (returnUser) {
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

    ctx.send({
      user: await sanitizeUser(user, ctx),
    });
  } else {
    const settings = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
      .get();

    ctx.redirect(settings.email_confirmation_redirection || '/');
  }
};
