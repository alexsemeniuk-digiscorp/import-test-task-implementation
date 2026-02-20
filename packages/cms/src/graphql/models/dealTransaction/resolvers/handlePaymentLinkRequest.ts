import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { sendEmail } from '../../../../api/email/sendEmail';
import { TwilioService } from '../../../../api/twilio/TwilioService';
import { getFirstName } from '../../../../graphql/helpers/getFirstName';
interface SendPaymentLinkRequestInput {
  paymentLink: string;
  email: string;
  contactId: ID;
  phone: string;
  sendByEmail: boolean;
  sendBySms: boolean;
  customSmsSubjectContent: string;
  customSmsContactContent: string;
  useCustomSmsContactContent: boolean;
  useCustomSmsSubjectContent: boolean;
  invoiceLink: string;
}

import { emailSender, smsSender } from '../../../models/helpers/email';
import { handleError, handleLogger } from './../../../helpers/errors';

export const handlePaymentLinkRequest: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  SendPaymentLinkRequestInput
> = async (_, args, ctx) => {
  const {
    paymentLink,
    email,
    contactId,
    phone,
    sendByEmail,
    sendBySms,
    customSmsSubjectContent,
    customSmsContactContent,
    invoiceLink,
  } = args;

  handleLogger(
    'info',
    'Resolver :: handlePaymentLinkRequest',
    `Params: {paymentLink: ${paymentLink}, email: ${email}, contactId: ${contactId}, phone: ${phone}, sendByEmail: ${sendByEmail}, sendBySms: ${sendBySms}, customSmsSubjectContent: ${customSmsSubjectContent}, customSmsContactContent: ${customSmsContactContent}, invoiceLink: ${invoiceLink}}`,
  );

  let contact;
  let tenant;
  let order;
  const errors: string[] = [];

  if (contactId) {
    try {
      contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        {
          populate: {
            tenant: {
              populate: ['mainLocation'],
            },
          },
        },
      );
    } catch (e) {
      handleError('handlePaymentLinkRequest', 'Contact is not available');
      errors.push('Contact is not available');
    }
  }

  try {
    tenant = await strapi.entityService.findMany('api::tenant.tenant', {
      filters: {
        users: {
          id: {
            $eq: ctx.state.user.id,
          },
        },
      },
      populate: [
        'nylas_connection',
        'nylas_connection.user',
        'twilioConnection',
        'mainLocation',
      ],
    });
  } catch (e) {
    handleError('handlePaymentLinkRequest', 'Tenant is not available');
    errors.push('Tenant is not available');
  }

  if (sendByEmail || email) {
    if (email) {
      try {
        await sendEmail(
          {
            meta: {
              to: email,
              from: emailSender(tenant[0].emailSender),
            },
            templateData: {
              templateReferenceId: 19,
            },
            variables: {
              INVOICE_LINK: invoiceLink ?? '',
              USER_NAME: 'Client',
              URL: paymentLink,
              TENANT_LOGO: tenant[0]?.logo?.url,
              TENANT_LOCATION:
                `${tenant[0]?.mainLocation?.address}, ${tenant[0]?.mainLocation?.zipcode}` ??
                '',
              EMAIL_SENDER: smsSender(tenant[0].emailSender),
            },
          },
          tenant[0]?.id,
        );
      } catch (e) {
        errors.push('Failed sent email to provided custom email');
        handleError(
          'handlePaymentLinkRequest',
          'Failed sent email to provided custom email',
        );
      }
    }

    if (sendByEmail && contact) {
      try {
        await sendEmail(
          {
            meta: {
              to: contact?.email,
              from: emailSender(tenant[0].emailSender),
            },
            templateData: {
              templateReferenceId: 19,
            },
            variables: {
              INVOICE_LINK: invoiceLink ?? '',
              USER_NAME: getFirstName(contact?.fullName),
              URL: paymentLink,
              TENANT_LOGO: tenant[0]?.logo?.url,
              TENANT_LOCATION:
                `${tenant[0]?.mainLocation?.address}, ${tenant[0]?.mainLocation?.zipcode}` ??
                '',
              EMAIL_SENDER: smsSender(tenant[0].emailSender),
            },
          },
          tenant[0]?.id,
        );
      } catch (e) {
        errors.push('Failed sent email to provided contact');
        handleError(
          'handlePaymentLinkRequest',
          'Failed sent email to provided contact',
        );
      }
    }
  }

  if (sendBySms || phone) {
    const defaultMessage = `Hello ${getFirstName(
      contact?.fullName,
    )}, please find your payment link below \n${smsSender(
      tenant[0].emailSender,
    )} \n${paymentLink}`;

    if (phone) {
      try {
        const twilioClient = new TwilioService(
          '',
          tenant[0].twilioConnection.accountSid,
        );
        await twilioClient.sendSMS({
          body: customSmsSubjectContent
            ? customSmsSubjectContent.replace(/{{link}}/g, paymentLink)
            : defaultMessage,
          clientNumber: phone,
          twilioNumber: tenant[0].twilioConnection.phoneNumber,
        });
      } catch (e) {
        errors.push('Failed sent SMS to provided phone number');
        handleError(
          'handlePaymentLinkRequest',
          `Failed sent SMS to provided phone number - ${e.message}`,
        );
      }
    }

    if (sendBySms && contact) {
      try {
        const twilioClient = new TwilioService(
          '',
          tenant[0].twilioConnection.accountSid,
        );
        await twilioClient.sendSMS({
          body: customSmsContactContent
            ? customSmsContactContent.replace(/{{link}}/g, paymentLink)
            : defaultMessage,
          clientNumber: contact.phoneNumber,
          twilioNumber: tenant[0].twilioConnection.phoneNumber,
        });
      } catch (e) {
        errors.push('Failed sent SMS to provided contact');
        handleError(
          'handlePaymentLinkRequest',
          'Failed sent SMS to provided contact',
        );
      }
    }
  }

  return {
    success: true,
    errors,
  };
};
