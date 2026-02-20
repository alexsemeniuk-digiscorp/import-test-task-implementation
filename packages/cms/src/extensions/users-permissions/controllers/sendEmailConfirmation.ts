import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors } from '@strapi/utils';

import { sendEmail } from '../../../api/email/sendEmail';
import { emailSender } from '../../../graphql/models/helpers/email';
import { generateCrypto } from '../../../utils/randomBytes';

export const sendEmailConfirmation = async (ctx) => {
  const { email, newEmployee, firstName, lastName, tenantName, password } =
    ctx.request.body;

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

  try {
    await sendEmail(
      {
        meta: {
          to: user.email,
          from: emailSender('CaratIQ'),
        },
        templateData: {
          templateReferenceId: newEmployee ? 4 : 2,
        },
        variables: {
          CODE: confirmationToken,
          URL: new URL(
            `/auth/email-confirmation?email=${user.email}&confirmation=`,
            process.env.FRONTEND_URL,
          ).toString(),
          USER: `${firstName} ${lastName}`,
          TENANT: tenantName,
          ...(newEmployee && {
            PASSWORD: password,
          }),
        },
      },
      user?.tenant?.id,
    );
  } catch (e) {
    throw new Error(e);
  }

  ctx.send({
    email: user.email,
    sent: true,
  });
};
