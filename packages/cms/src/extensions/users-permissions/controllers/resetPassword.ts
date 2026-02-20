import { validateResetPasswordBody } from '@strapi/plugin-users-permissions/server/controllers/validation/auth';
import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors, sanitize } from '@strapi/utils';
import { createSessionWithToken } from '../../../graphql/helpers/createSessionWithToken';

const { ValidationError } = errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

export const resetPassword = async (ctx) => {
  const validations = strapi.config.get(
    'plugin::users-permissions.validationRules',
  );

  const { password, passwordConfirmation, code } =
    await validateResetPasswordBody(ctx.request.body, validations);

  if (password !== passwordConfirmation) {
    throw new ValidationError('Passwords do not match');
  }

  const user = await strapi.db
    .query('plugin::users-permissions.user')
    .findOne({ where: { resetPasswordToken: code } });

  if (!user) {
    throw new ValidationError('Incorrect code provided');
  }

  await getService('user').edit(user.id, {
    resetPasswordToken: null,
    password,
  });

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

  // Update the user.
  ctx.send({
    user: await sanitizeUser(user, ctx),
  });
};
