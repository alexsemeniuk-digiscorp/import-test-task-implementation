import { sendEmail } from '../../../api/email/sendEmail';
import { getMinutesInFuture } from '../../../graphql/helpers/time';
import { generatePassword } from '../../../utils/randomBytes';

export const forgotPassword = async (ctx) => {
  const ORIGIN_URL = ctx.request.header.origin;
  const { email } = ctx.request.body;

  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { email: email.toLowerCase() },
    populate: { tenant: true },
  });

  if (!user || user.blocked) {
    throw new Error('Email not found');
  }

  const tenant = await strapi.entityService.findOne(
    'api::tenant.tenant',
    user.tenant.id,
    {
      populate: { websites: true },
    },
  );

  const resetPasswordToken = generatePassword(8);

  const resetPasswordTokenExpiration = getMinutesInFuture(10);

  const userService: UsersPermissions.UserService = strapi
    .plugin('users-permissions')
    .service('user');

  await userService.edit(user.id, {
    resetPasswordToken,
    resetPasswordTokenExpiration,
  });

  if (ORIGIN_URL === process.env.FRONTEND_URL) {
    await sendEmail(
      {
        meta: {
          to: user.email,
        },
        templateData: {
          templateReferenceId: 3,
        },
        variables: {
          URL: `${ORIGIN_URL}/auth/reset-password`,
          TOKEN: resetPasswordToken,
          USER: `${user?.firstName} ${user?.lastName}`,
        },
      },
      tenant?.id,
    );
  } else {
    const website = await strapi.entityService.findOne(
      'api::website.website',
      tenant.websites[0].id,
      {
        populate: {
          initialSettings: {
            populate: {
              heading: true,
              image: { populate: { media: true } },
            },
          },
        },
      },
    );
    const logo = website?.initialSettings?.image?.find(
      (it) => it?.title === 'logo',
    );

    await sendEmail(
      {
        meta: {
          to: user.email,
        },
        templateData: {
          templateReferenceId: 8,
        },
        variables: {
          URL: `${ORIGIN_URL}/auth/reset-password`,
          TOKEN: resetPasswordToken,
          WEBSITE: {
            name: website.initialSettings.heading.subtitle,
            logoUrl: logo.media.url,
          },
        },
      },
      tenant?.id,
    );
  }

  ctx.send({ ok: true });
};
