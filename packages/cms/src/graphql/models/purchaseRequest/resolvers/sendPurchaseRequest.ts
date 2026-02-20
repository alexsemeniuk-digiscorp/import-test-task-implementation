import { GraphQLFieldResolver } from 'graphql';
import { TwilioService } from '../../../../api/twilio/TwilioService';
import createActivityFromSendEvent from '../../../helpers/createContactActivityFromSendEvent';
import { getFirstName } from '../../../helpers/getFirstName';
import { smsSender } from '../../helpers/email';
import {
  getEmailContent,
  type PurchaseRequestType,
} from '../helpers/getEmailContent';
import { normalizeEmailBody } from '../helpers/normalizeEmailBody';
import { SendPurchaseRequestInput } from '../types';
import { handleError, handleLogger } from './../../../helpers/errors';
export const sendPurchaseRequest: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  SendPurchaseRequestInput
> = async (_, args, ctx) => {
  const {
    id,
    email,
    subject,
    body,
    fileUrl,
    contactId,
    phone,
    sendByEmail,
    sendBySms,
    customSmsSubjectContent,
    customSmsContactContent,
  } = args;

  handleLogger(
    'info',
    'Resolver :: sendPurchaseRequest',
    `Params: {id: ${id} }, email: ${email}, contactId: ${contactId}, phone: ${phone}, sendByEmail: ${sendByEmail}, sendBySms: ${sendBySms}, customSmsSubjectContent: ${customSmsSubjectContent}, customSmsContactContent: ${customSmsContactContent}, fileUrl: ${fileUrl}`,
  );

  const purchaseRequest = await strapi.entityService.findOne(
    'api::purchase-request.purchase-request',
    id,
    {
      populate: {
        tenant: {
          populate: ['nylas_connection', 'nylas_connection.user'],
        },
        orderId: {
          populate: ['company'],
        },
        shippingInfo: true,
        fileItem: {
          populate: ['attachedFile'],
        },
      },
    },
  );

  if (!purchaseRequest?.fileItem?.attachedFile) {
    handleError('sendPurchaseRequest', 'Attached file is not available');
    return {
      success: false,
      errors: ['Attached file is not available'],
    };
  }

  const purchaseReqUrl = purchaseRequest?.fileItem?.attachedFile?.url || '';

  let contact;
  let twilioConnection;
  let nylasConnection;
  let nylasService;
  const errors: string[] = [];

  if (contactId) {
    try {
      contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        { populate: ['tenant'] },
      );
    } catch (e) {
      handleError('sendPurchaseRequest', 'Contact is not available');
      errors.push('Contact is not available');
    }
  }

  let emailContent = { body: '', subject: '' };

  if (!body && !subject) {
    emailContent = getEmailContent(purchaseRequest as PurchaseRequestType, ctx);
  }

  if (sendByEmail || email) {
    try {
      nylasService = await strapi.service(
        'api::nylas-connection.nylas-connection',
      );
      nylasConnection = purchaseRequest.tenant.nylas_connection.find(
        (el) => el.user.id === ctx.state.user.id,
      );
    } catch (e) {
      errors.push('Nylas integration is not connected');
      handleError('sendPurchaseRequest', 'Nylas integration is not connected');
    }

    if (email) {
      try {
        await nylasService.sendEmail(nylasConnection.id, {
          to: [
            {
              email,
            },
          ],
          from: [
            {
              email: ctx.state.user.email,
            },
          ],
          subject: subject ?? emailContent.subject,
          body: body ? normalizeEmailBody(body, fileUrl) : emailContent.body,
        });
      } catch (e) {
        errors.push(
          'Failed sent email to provided custom email, please connect Nylas integration',
        );
        handleError(
          'sendPurchaseRequest',
          'Failed sent email to provided custom email, please connect Nylas integration',
        );
      }
    }

    if (sendByEmail && contact) {
      try {
        await nylasService.sendEmail(nylasConnection.id, {
          to: [
            {
              email: contact.email ?? purchaseRequest.orderId.company.email,
            },
          ],
          from: [
            {
              email: ctx.state.user.email,
            },
          ],
          subject: subject ?? emailContent.subject,
          body: body ? normalizeEmailBody(body, fileUrl) : emailContent.body,
        });
      } catch (e) {
        errors.push('Failed sent email to provided contact');
        handleError(
          'sendPurchaseRequest',
          'Failed sent email to provided contact,please connect Nylas integration',
        );
      }

      const payload = {
        recipient: contact.email,
        link: purchaseReqUrl,
      };

      try {
        await createActivityFromSendEvent(
          String(contact?.id),
          'email',
          'purchase',
          JSON.stringify(payload),
          String(purchaseRequest?.tenant?.id),
          'contact',
        );
      } catch (error) {
        handleError(
          'sendPurchaseRequest',
          'Failed to create activity from send email event',
          error,
        );
        errors.push('Failed to create activity from send email event');
      }
    }
  }

  if (sendBySms || phone) {
    try {
      twilioConnection = await strapi.entityService.findMany(
        'api::twilio-connection.twilio-connection',
        {
          filters: { tenant: { id: { $eq: purchaseRequest.tenant.id } } },
        },
      );
    } catch (e) {
      errors.push('Twilio connection is not available');
      handleError('sendPurchaseRequest', 'Twilio connection is not available');
    }

    const firstName = getFirstName(contact?.fullName);
    const defaultMessage = `Hello ${firstName}, please find attached our purchase request link below. \n${smsSender(
      purchaseRequest?.tenant?.emailSender,
    )} \n${purchaseReqUrl}`;

    if (phone) {
      try {
        const twilioClient = new TwilioService(
          '',
          twilioConnection[0].accountSid,
        );
        await twilioClient.sendSMS({
          body: customSmsSubjectContent
            ? customSmsSubjectContent.replace(/{{link}}/g, purchaseReqUrl)
            : defaultMessage,
          clientNumber: phone,
          twilioNumber: twilioConnection[0].phoneNumber,
        });
      } catch (e) {
        errors.push('Failed sent SMS to provided phone number');
        handleError(
          'sendPurchaseRequest',
          'Failed sent SMS to provided phone number',
        );
      }
    }

    if (sendBySms && contact) {
      try {
        const twilioClient = new TwilioService(
          '',
          twilioConnection[0].accountSid,
        );
        await twilioClient.sendSMS({
          body: customSmsContactContent
            ? customSmsContactContent.replace(/{{link}}/g, purchaseReqUrl)
            : defaultMessage,
          clientNumber: contact.phoneNumber,
          twilioNumber: twilioConnection[0].phoneNumber,
        });
      } catch (e) {
        errors.push('Failed sent SMS to provided contact');
        handleError(
          'sendPurchaseRequest',
          'Failed sent SMS to provided contact',
        );
      }

      const payload = {
        recipient: contact.phoneNumber,
        link: purchaseReqUrl,
      };

      try {
        await createActivityFromSendEvent(
          String(contact?.id),
          'sms',
          'purchase',
          JSON.stringify(payload),
          String(purchaseRequest?.tenant?.id),
          'contact',
        );
      } catch (error) {
        handleError(
          'sendPurchaseRequest',
          'Failed to create activity from send sms event',
          error,
        );
        errors.push('Failed to create activity from send sms event');
      }
    }
  }

  return {
    success: true,
    errors,
  };
};
