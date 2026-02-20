import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { errors } from '@strapi/utils';

import { GraphQLFieldResolver } from 'graphql';

import { capitalize } from 'lodash';
import { sendEmail } from '../../../../api/email/sendEmail';
import { emailSender } from '../../../../graphql/models/helpers/email';
import {
  generateCrypto,
  generatePassword,
} from '../../../../utils/randomBytes';
import { UserResendConfirmationInput } from '../user.types';
import {
  COOL_DOWN_PERIOD_IN_MILLISECONDS,
  COOL_DOWN_PERIOD_IN_MINUTES,
} from './../../../constants';

export const resendConfirmation: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  { input: UserResendConfirmationInput }
> = async (root, { input }, ctx) => {
  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { email: input.email.toLowerCase() },
    populate: { tenant: true, role: true },
  });

  const isEmployee = user.role.type === 'employee';

  if (!user) {
    throw new errors.ApplicationError(
      `${capitalize(input.type)} doesn't exist`,
    );
  }

  const lastConfirmationEmailSentAt = new Date(user.updatedAt).getTime();
  const currentTime = new Date().getTime();

  if (
    currentTime - lastConfirmationEmailSentAt <
    COOL_DOWN_PERIOD_IN_MILLISECONDS
  ) {
    throw new errors.ApplicationError(
      `You should wait at least ${COOL_DOWN_PERIOD_IN_MINUTES} min to resend the email`,
    );
  }

  if (user.confirmed) {
    throw new errors.ApplicationError(
      `This ${input.type} is already confirmed`,
    );
  }

  if (user.blocked) {
    throw new errors.ApplicationError(`This ${input.type} is blocked`);
  }

  const confirmationToken = generateCrypto();
  const password = generatePassword();

  const params = isEmployee
    ? { confirmationToken, password }
    : { confirmationToken };

  await getService('user').edit(user.id, params);

  try {
    await sendEmail(
      {
        meta: {
          to: user.email,
          from: emailSender('CaratIQ'),
        },
        templateData: {
          templateReferenceId: isEmployee ? 4 : 2,
        },
        variables: {
          CODE: confirmationToken,
          URL: new URL(
            `/auth/email-confirmation?email=${user.email}&confirmation=`,
            process.env.FRONTEND_URL,
          ).toString(),
          USER: `${user.firstName} ${user.lastName}`,
          TENANT: user.tenant,
          ...(isEmployee && {
            PASSWORD: password,
          }),
        },
      },
      user?.tenant?.id,
    );
  } catch (e) {
    throw new Error(`${e}`);
  }
};
