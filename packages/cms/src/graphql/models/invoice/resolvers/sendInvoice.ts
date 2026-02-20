import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { sendEmail } from '../../../../api/email/sendEmail';
import { TwilioService } from '../../../../api/twilio/TwilioService';
import createActivityFromSendEvent from '../../../helpers/createContactActivityFromSendEvent';
import { getFirstName } from '../../../helpers/getFirstName';
import { emailReplyTo, emailSender, smsSender } from '../../helpers/email';
import { handleError, handleLogger } from './../../../helpers/errors';

export const sendInvoice: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  {
    id: ID;
    subjectEmail: string;
    contactId: ID;
    fileType: string;
    subjectPhone: string;
    customSubjectMessage: string;
    customContactMessage: string;
    sendBySms: boolean;
    sendByEmail: boolean;
  }
> = async (_, args, ctx) => {
  const {
    id,
    subjectEmail,
    contactId,
    fileType,
    subjectPhone,
    customSubjectMessage,
    customContactMessage,
    sendByEmail,
    sendBySms,
  } = args;
  handleLogger(
    'info',
    'Resolver :: sendInvoice',
    `Params: {id: ${id} }, subjectEmail: ${subjectEmail}, contactId: ${contactId}, fileType: ${fileType}, subjectPhone: ${subjectPhone}, customSubjectMessage: ${customSubjectMessage}, customContactMessage: ${customContactMessage}, sendByEmail: ${sendByEmail}, sendBySms: ${sendBySms}`,
  );

  const invoice = await strapi.entityService.findOne(
    'api::invoice.invoice',
    id,
    {
      populate: {
        orderId: {
          populate: ['contact', 'company'],
        },
        tenant: {
          populate: ['logo', 'mainLocation'],
        },
        shippingContact: true,
        fileItem: {
          populate: ['attachedFile'],
        },
      },
    },
  );

  console.log(invoice.orderId.id, 'invoice.orderId.id');

  if (invoice.tenant?.id !== ctx.state.user.tenantId) {
    handleError('sendInvoice', 'You are not allowed to perform this action');
    return {
      success: false,
      errors: ['You are not allowed to perform this action'],
    };
  }

  if (!invoice.fileItem) {
    handleError('sendInvoice', 'Invoice file is not available');
    return {
      success: false,
      errors: ['Invoice file is not available'],
    };
  }

  const isRepairTicket = fileType === 'repair_ticket';
  const invoiceUrl = invoice?.fileItem?.attachedFile?.url;
  const errors: string[] = [];
  let contact;

  if (contactId) {
    try {
      contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
        { populate: ['tenant'] },
      );
    } catch (e) {
      handleError('sendInvoice', 'Error fetching contact');
      errors.push('Contact is not available');
    }
  }

  let twilioConnection;

  if (sendBySms || subjectPhone) {
    twilioConnection = await strapi.entityService.findMany(
      'api::twilio-connection.twilio-connection',
      {
        filters: { tenant: { id: { $eq: invoice.tenant.id } } },
      },
    );

    if (!twilioConnection.length) {
      handleError('sendInvoice', 'Twilio connection is not available');
      errors.push('Twilio connection is not available');
    }
  }

  if (sendBySms && contact) {
    const firstName = getFirstName(contact.fullName);
    const defaultMessage = `Hello ${firstName}, please find your ${
      isRepairTicket ? 'repair ticket' : 'invoice'
    } on the link below \n${smsSender(
      invoice?.tenant?.emailSender,
    )} \n${invoiceUrl}`;
    try {
      const twilioClient = new TwilioService(
        '',
        twilioConnection[0].accountSid,
      );
      await twilioClient.sendSMS({
        body: customContactMessage
          ? customContactMessage.replace(/{{link}}/g, invoiceUrl)
          : defaultMessage,
        clientNumber: contact.phoneNumber,
        twilioNumber: twilioConnection[0].phoneNumber,
      });
    } catch (e) {
      handleError('sendInvoice', 'Failed to send SMS to provided contact');
      errors.push('Failed to send SMS to provided contact');
    }

    const payload = {
      recipient: contact.phoneNumber,
      link: invoiceUrl,
      orderId: invoice.orderId.orderId,
      order: invoice.orderId.id,
    };

    try {
      await createActivityFromSendEvent(
        String(contact?.id),
        'sms',
        'invoice',
        JSON.stringify(payload),
        String(invoice.tenant.id),
        'contact',
      );
    } catch (error) {
      handleError(
        'sendInvoice',
        'Failed to create activity from send sms event',
        error,
      );
      errors.push('Failed to create activity from send sms event');
    }
  }

  if (subjectPhone) {
    let name;
    if (invoice?.orderId?.company) {
      name = invoice?.orderId?.company?.name;
    } else {
      name = getFirstName(invoice?.orderId?.contact?.fullName);
    }
    const defaultMessage = `Hello ${name}, please find your ${
      isRepairTicket ? 'repair ticket' : 'invoice'
    } on the link below \n${smsSender(
      invoice?.tenant?.emailSender,
    )} \n${invoiceUrl}`;
    try {
      const twilioClient = new TwilioService(
        '',
        twilioConnection[0].accountSid,
      );
      await twilioClient.sendSMS({
        body: customSubjectMessage
          ? customSubjectMessage.replace(/{{link}}/g, invoiceUrl)
          : defaultMessage,
        clientNumber: subjectPhone,
        twilioNumber: twilioConnection[0].phoneNumber,
      });
    } catch (e) {
      handleError('sendInvoice', 'Failed to send SMS to provided phone number');
      errors.push('Failed to send SMS to provided phone number');
    }

    if (invoice?.orderId?.contact?.id) {
      const payload = {
        recipient: subjectPhone,
        link: invoiceUrl,
        orderId: invoice.orderId.orderId,
        order: invoice.orderId.id,
      };

      try {
        await createActivityFromSendEvent(
          String(invoice?.orderId?.contact?.id),
          'sms',
          'invoice',
          JSON.stringify(payload),
          String(invoice.tenant.id),
          'contact',
        );
      } catch (error) {
        handleError(
          'sendInvoice',
          'Failed to create activity from send sms event',
          error,
        );
        errors.push('Failed to create activity from send sms event');
      }
    }
  }

  if (subjectEmail) {
    let name;
    if (invoice?.orderId?.company) {
      name = invoice?.orderId?.company?.name;
    } else {
      name = getFirstName(invoice?.orderId?.contact?.fullName);
    }

    try {
      await sendEmail(
        {
          meta: {
            to: subjectEmail,
            from: emailSender(invoice?.tenant?.emailSender),
            replyTo: emailReplyTo(invoice?.tenant?.email),
          },
          templateData: {
            templateReferenceId: 6,
          },
          variables: {
            FILE_TYPE_CAPITAL: isRepairTicket ? 'Repair ticket' : 'Invoice',
            FILE_TYPE: isRepairTicket ? 'repair ticket' : 'invoice',
            BODY_TEXT: isRepairTicket
              ? ''
              : 'Thank you for your recent purchase! ',
            TENANT: invoice?.tenant?.companyName,
            IMAGE_URL: invoice?.fileItem?.attachedFile?.url,
            TENANT_LOGO: invoice?.tenant?.logo?.url,
            TENANT_LOCATION: invoice?.tenant?.mainLocation?.address ?? '',
            USER_NAME: name,
            SENDER_NAME: smsSender(invoice?.tenant?.emailSender) ?? '',
          },
        },
        invoice?.tenant?.id,
      );
    } catch (e) {
      handleError('sendInvoice', 'Failed to send email to provided email');
      errors.push('Failed to send email to provided email');
    }

    if (invoice?.orderId?.contact?.id) {
      const payload = {
        recipient: subjectEmail,
        link: invoiceUrl,
        orderId: invoice.orderId.orderId,
        order: invoice.orderId.id,
      };

      try {
        await createActivityFromSendEvent(
          String(invoice?.orderId?.contact?.id),
          'email',
          'invoice',
          JSON.stringify(payload),
          String(invoice.tenant.id),
          'contact',
        );
      } catch (error) {
        handleError(
          'sendInvoice',
          'Failed to create activity from send email event',
          error,
        );
        errors.push('Failed to create activity from send email event');
      }
    }
  }

  if (sendByEmail && contact) {
    const firstName = getFirstName(contact.fullName);
    try {
      await sendEmail(
        {
          meta: {
            to: contact.email,
            from: emailSender(invoice?.tenant?.emailSender),
            replyTo: emailReplyTo(invoice?.tenant?.email),
          },
          templateData: {
            templateReferenceId: 6,
          },
          variables: {
            FILE_TYPE_CAPITAL: isRepairTicket ? 'Repair ticket' : 'Invoice',
            FILE_TYPE: isRepairTicket ? 'repair ticket' : 'invoice',
            BODY_TEXT: isRepairTicket
              ? ''
              : 'Thank you for your recent purchase! ',
            TENANT: invoice?.tenant?.companyName,
            IMAGE_URL: invoice?.fileItem?.attachedFile?.url ?? '',
            TENANT_LOGO: invoice?.tenant?.logo?.url ?? '',
            USER_NAME: firstName,
            TENANT_LOCATION: invoice?.tenant?.mainLocation?.address ?? '',
            SENDER_NAME: smsSender(invoice?.tenant?.emailSender) ?? '',
          },
        },
        invoice?.tenant?.id,
      );
    } catch (e) {
      handleError('sendInvoice', 'Failed to send email to provided contact');
      errors.push('Failed to send email to provided contact');
    }

    const payload = {
      recipient: contact.email,
      link: invoiceUrl,
      orderId: invoice.orderId.orderId,
      order: invoice.orderId.id,
    };

    try {
      await createActivityFromSendEvent(
        String(contact?.id),
        'email',
        'invoice',
        JSON.stringify(payload),
        String(invoice.tenant.id),
        'contact',
      );
    } catch (error) {
      handleError(
        'sendInvoice',
        'Failed to create activity from send email event',
        error,
      );
      errors.push('Failed to create activity from send email event');
    }
  }

  return {
    success: true,
    errors: [],
  };
};
