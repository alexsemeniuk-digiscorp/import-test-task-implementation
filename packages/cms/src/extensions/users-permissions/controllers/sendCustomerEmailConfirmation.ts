import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors } from '@strapi/utils';

import { sendEmail } from '../../../api/email/sendEmail';
import { generateCrypto } from '../../../utils/randomBytes';

export const sendCustomerEmailConfirmation = async (ctx) => {
  const { email, websiteId } = ctx.request.body;

  const BASE_URL = ctx.request.header.origin;

  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { email: email.toLowerCase() },
    populate: { tenant: true },
  });

  if (!user) {
    return ctx.send({ email, sent: true });
  }

  if (user.confirmed) {
    throw new errors.ApplicationError('Already confirmed');
  }

  if (user.blocked) {
    throw new errors.ApplicationError('User blocked');
  }

  const confirmationToken = generateCrypto();

  await getService('user').edit(user.id, { confirmationToken });

  const website = await strapi.entityService.findOne(
    'api::website.website',
    websiteId,
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
        templateReferenceId: 9,
      },
      variables: {
        CODE: confirmationToken,
        URL: new URL(
          '/auth/email-confirmation?confirmation=',
          BASE_URL,
        ).toString(),
        WEBSITE: {
          name: website.initialSettings.heading.subtitle,
          logoUrl: logo.media.url,
        },
      },
    },
    user?.tenant?.id,
  );

  ctx.send({
    email: user.email,
    sent: true,
  });
};
