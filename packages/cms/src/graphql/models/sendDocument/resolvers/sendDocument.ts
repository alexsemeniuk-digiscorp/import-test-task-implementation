import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { sendEmail } from '../../../../api/email/sendEmail';
import { TwilioService } from '../../../../api/twilio/TwilioService';
import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { generateId } from '../../../../utils/randomBytes';
import createActivityFromSendEvent from '../../../helpers/createContactActivityFromSendEvent';
import { getFirstName } from '../../../helpers/getFirstName';
import { emailReplyTo, emailSender, smsSender } from '../../helpers/email';
import {
  generateContractLink,
  generateFormLink,
} from '../helpers/generateLink';

export const sendDocument: GraphQLFieldResolver<
  null,
  Graphql.ResolverContext,
  {
    templateId: ID;
    docType: string;
    contactId: ID;
    body: string;
    sendBySms: boolean;
    sendByEmail: boolean;
    subjectEmail: string;
    subjectPhone: string;
    customSmsContactContent: string;
    customSmsSubjectContent: string;
  }
> = async (_, args, ctx) => {
  handleLogger(
    'info',
    'Resolver :: sendDocument',
    `Params: ${JSON.stringify(args)}`,
  );

  const {
    templateId,
    docType,
    contactId,
    sendBySms,
    sendByEmail,
    subjectEmail,
    subjectPhone,
    customSmsContactContent,
    customSmsSubjectContent,
  } = args;

  const errors: string[] = [];

  if (docType === 'contract') {
    let template, contact, publicContract, contract, twilioConnection;

    try {
      template = await strapi.entityService.findOne(
        'api::contract-template.contract-template',
        templateId,
        {
          populate: ['tenant', 'tenant.logo', 'tenant.mainLocation'],
        },
      );
    } catch (error) {
      handleError('sendDocument', 'Failed to fetch template', error);
      errors.push('Failed to get template');
    }

    try {
      contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
      );
    } catch (error) {
      handleError('sendDocument', 'Failed to fetch contact', error);
      errors.push('Failed to get contact');
    }

    try {
      publicContract = await strapi.entityService.create(
        'api::public-contract.public-contract',
        {
          data: {
            body: template?.body,
            companySignature: template?.companySignature,
            status: 'pending',
            companySignDate: template?.companySignDate,
            companySignName: template?.companySignName,
          },
        },
      );
    } catch (error) {
      handleError('sendDocument', 'Failed to create public contract', error);
      errors.push('Failed to create public contract');
    }

    try {
      contract = await strapi.entityService.create('api::contract.contract', {
        data: {
          tenant: template?.tenant?.id,
          publicContract: publicContract?.id,
          name: `Contract with ${
            contact?.fullName ?? 'Client'
          } ${Intl.DateTimeFormat('en-US').format(new Date())}`,
          contact: contactId,
          contractId: generateId(),
        },
      });
    } catch (error) {
      handleError('sendDocument', 'Failed to create contract', error);
      errors.push('Failed to create contract');
    }

    const generatedLink = generateContractLink(publicContract?.uuid);

    try {
      await strapi.entityService.update(
        'api::contract.contract',
        contract?.id,
        {
          data: {
            link: generatedLink,
          },
        },
      );
    } catch (error) {
      handleError('sendDocument', 'Failed to update contract with link', error);
      errors.push('Failed to update contract with link');
    }

    if (subjectEmail) {
      try {
        await sendEmail(
          {
            meta: {
              to: subjectEmail,
              from: emailSender(template?.tenant?.emailSender),
              replyTo: emailReplyTo(template?.tenant?.email),
            },
            templateData: {
              templateReferenceId: 11,
            },
            variables: {
              USER_NAME: getFirstName(contact?.fullName),
              LINK: generatedLink,
              COMPANY_NAME: template?.tenant?.companyName,
              SENDER_NAME: smsSender(template?.tenant?.emailSender),
              TENANT_LOGO: template?.tenant?.logo?.url ?? '',
              TENANT_LOCATION:
                `${template?.tenant?.mainLocation?.address}, ${template?.tenant?.mainLocation?.zipcode}` ??
                '',
            },
          },
          template?.tenant?.id,
        );
      } catch (e) {
        errors.push('Failed to send email to provided custom email');
        handleError(
          'sendDocument',
          'Failed to send email to provided custom email',
        );
      }

      const payload = {
        recipient: subjectEmail,
        link: generatedLink,
      };

      try {
        await createActivityFromSendEvent(
          contact.id,
          'email',
          'contract',
          JSON.stringify(payload),
          template?.tenant?.id,
          'contact',
        );
      } catch (error) {
        handleError(
          'sendDocument',
          'Failed to create activity from send email event',
          error,
        );
        errors.push('Failed to create activity from send email event');
      }
    }

    if (sendByEmail && contact) {
      const firstName = getFirstName(contact?.fullName);
      try {
        await sendEmail(
          {
            meta: {
              to: contact.email,
              from: emailSender(template?.tenant?.emailSender),
              replyTo: emailReplyTo(template?.tenant?.email),
            },
            templateData: {
              templateReferenceId: 11,
            },
            variables: {
              USER_NAME: firstName,
              LINK: generatedLink,
              COMPANY_NAME: template?.tenant?.companyName,
              SENDER_NAME: smsSender(template?.tenant?.emailSender),
              TENANT_LOGO: template?.tenant?.logo?.url,
              TENANT_LOCATION:
                `${template?.tenant?.mainLocation?.address}, ${template?.tenant?.mainLocation?.zipcode}` ??
                '',
            },
          },
          template?.tenant?.id,
        );
      } catch (e) {
        errors.push('Failed to send email to provided contact');
        handleError('sendDocument', 'Failed to send email to provided contact');
      }

      const payload = {
        recipient: contact.email,
        link: generatedLink,
      };

      try {
        await createActivityFromSendEvent(
          contact.id,
          'email',
          'contract',
          JSON.stringify(payload),
          template?.tenant?.id,
          'contact',
        );
      } catch (error) {
        handleError(
          'sendDocument',
          'Failed to create activity from send email event',
          error,
        );
        errors.push('Failed to create activity from send email event');
      }
    }

    if (sendBySms || subjectPhone) {
      try {
        twilioConnection = await strapi.entityService.findMany(
          'api::twilio-connection.twilio-connection',
          {
            filters: { tenant: { id: { $eq: template.tenant.id } } },
          },
        );
      } catch (e) {
        errors.push('Twilio connection is not available');
        handleError('sendDocument', 'Twilio connection is not available');
      }
      const firstName = getFirstName(contact?.fullName);
      const defaultMessage = `Hello ${firstName}, please find the contract below for your signature \n${smsSender(
        template?.tenant?.emailSender,
      )} \n${generatedLink}`;

      if (subjectPhone) {
        try {
          const twilioClient = new TwilioService(
            '',
            twilioConnection[0].accountSid,
          );
          await twilioClient.sendSMS({
            body: customSmsSubjectContent
              ? customSmsSubjectContent.replace(/{{link}}/g, generatedLink)
              : defaultMessage,
            clientNumber: subjectPhone,
            twilioNumber: twilioConnection[0].phoneNumber,
          });
        } catch (e) {
          errors.push('Failed to send SMS to provided phone number');
          handleError(
            'sendDocument',
            'Failed to send SMS to provided phone number',
          );
        }

        const payload = {
          recipient: subjectPhone,
          link: generatedLink,
        };

        try {
          await createActivityFromSendEvent(
            contact.id,
            'sms',
            'contract',
            JSON.stringify(payload),
            template?.tenant?.id,
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send sms event',
            error,
          );
          errors.push('Failed to create activity from send sms event');
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
              ? customSmsContactContent.replace(/{{link}}/g, generatedLink)
              : defaultMessage,
            clientNumber: contact.phoneNumber,
            twilioNumber: twilioConnection[0].phoneNumber,
          });
        } catch (e) {
          errors.push('Failed to send SMS to provided contact');
          handleError('sendDocument', 'Failed to send SMS to provided contact');
        }

        const payload = {
          recipient: contact.phoneNumber,
          link: generatedLink,
        };

        try {
          await createActivityFromSendEvent(
            contact.id,
            'sms',
            'contract',
            JSON.stringify(payload),
            template?.tenant?.id,
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
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
  }
  if (docType === 'form') {
    let contact, publicForm, form, generatedLink, twilioConnection;
    const user = ctx.state.user ?? null;

    const formTemplate = await strapi.entityService.findOne(
      'api::form-template.form-template',
      templateId,
      {
        populate: ['tenant', 'file'],
      },
    );

    const tenant = await strapi.entityService.findOne(
      'api::tenant.tenant',
      formTemplate.tenant.id,
      {
        populate: ['logo', 'mainLocation'],
      },
    );

    if (contactId) {
      try {
        contact = await strapi.entityService.findOne(
          'api::contact.contact',
          contactId,
        );
      } catch (e) {
        handleError('sendDocument', 'Failed to fetch contact', e);
        errors.push('Failed to get contact');
      }
    }

    if (sendBySms || subjectPhone) {
      try {
        twilioConnection = await strapi.entityService.findMany(
          'api::twilio-connection.twilio-connection',
          {
            filters: { tenant: { id: { $eq: formTemplate.tenant.id } } },
          },
        );
      } catch (e) {
        handleError('sendDocument', 'Failed to fetch twilio connection', e);
        errors.push('Failed to get twilio connection');
      }
    }

    try {
      publicForm = await strapi.entityService.create(
        'api::public-form.public-form',
        {
          data: {
            body: formTemplate.body,
            title: formTemplate.title,
            file: formTemplate.file?.id ?? null,
            description: formTemplate.description,
            customerName: contact?.fullName ?? '',
            submitted: false,
          },
        },
      );
    } catch (e) {
      handleError('sendDocument', 'Failed to create public form', e);
      errors.push('Failed to create public form');
    }

    if (contact) {
      try {
        form = await strapi.entityService.create('api::form.form', {
          data: {
            publicForm: publicForm.id,
            formId: generateId(),
            name: formTemplate.title,
            tenant: formTemplate.tenant.id,
            sendTo: contact.email,
            contact: contactId,
          },
        });

        generatedLink = generateFormLink(publicForm.uuid);

        await strapi.entityService.update('api::form.form', form.id, {
          data: {
            link: generatedLink,
          },
        });
      } catch (e) {
        handleError('sendDocument', 'Failed to create form', e);
        errors.push('Failed to create form');
      }

      if (sendByEmail) {
        const firstName = getFirstName(contact?.fullName);
        await sendEmail(
          {
            meta: {
              to: contact.email,
              from: emailSender(tenant?.emailSender),
              replyTo: emailReplyTo(tenant?.email),
            },
            templateData: {
              templateReferenceId: 12,
            },
            variables: {
              TENANT_COMPANY_NAME:
                `${user?.firstName} ${user?.lastName} from ${tenant?.companyName}` ??
                '',
              TENANT_LOCATION:
                `${tenant?.mainLocation?.address}, ${tenant.mainLocation.zipcode}` ??
                '',
              TENANT_LOGO: tenant?.logo?.url ?? '',
              CUSTOMER_NAME: firstName ?? '',
              SENDER_NAME: smsSender(tenant?.emailSender),
              LINK: generatedLink,
            },
          },
          tenant?.id,
        );

        const payload = {
          recipient: contact.email,
          link: generatedLink,
        };

        try {
          await createActivityFromSendEvent(
            contact.id,
            'email',
            'form',
            JSON.stringify(payload),
            String(tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send email event',
            error,
          );
          errors.push('Failed to create activity from send email event');
        }
      }

      if (sendBySms) {
        const firstName = getFirstName(contact?.fullName);
        const defaultMessage = `Hello ${firstName}, please fill out the form below \n${smsSender(
          tenant?.emailSender,
        )} \n${generatedLink}`;
        try {
          const twilioClient = new TwilioService(
            '',
            twilioConnection[0].accountSid,
          );
          await twilioClient.sendSMS({
            body: customSmsContactContent
              ? customSmsContactContent.replace(/{{link}}/g, generatedLink)
              : defaultMessage,
            clientNumber: contact.phoneNumber,
            twilioNumber: twilioConnection[0].phoneNumber,
          });
        } catch (e) {
          handleError(
            'sendDocument',
            'Failed to send SMS to provided contact',
            e,
          );
          errors.push('Failed to send SMS to provided contact');
        }

        const payload = {
          recipient: contact.phoneNumber,
          link: generatedLink,
        };

        try {
          await createActivityFromSendEvent(
            contact.id,
            'sms',
            'form',
            JSON.stringify(payload),
            String(tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send sms event',
            error,
          );
          errors.push('Failed to create activity from send sms event');
        }
      }
    }

    if (subjectEmail || subjectPhone) {
      try {
        form = await strapi.entityService.create('api::form.form', {
          data: {
            publicForm: publicForm.id,
            formId: generateId(),
            name: formTemplate.title,
            tenant: formTemplate.tenant.id,
            sendTo: subjectEmail,
          },
        });

        generatedLink = generateFormLink(publicForm.uuid);

        await strapi.entityService.update('api::form.form', form.id, {
          data: {
            link: generatedLink,
          },
        });
      } catch (e) {
        handleError('sendDocument', 'Failed to create form', e);
        errors.push('Failed to create form');
      }

      if (subjectEmail) {
        try {
          const name = getFirstName(contact?.fullName);
          await sendEmail(
            {
              meta: {
                to: subjectEmail,
                from: emailSender(tenant?.emailSender),
                replyTo: emailReplyTo(tenant?.email),
              },
              templateData: {
                templateReferenceId: 12,
              },
              variables: {
                TENANT_COMPANY_NAME:
                  `${user?.firstName ?? ''} ${
                    user?.lastName ?? 'Client'
                  } from ${tenant?.companyName}` ?? '',
                TENANT_LOCATION:
                  `${tenant?.mainLocation?.address}, ${tenant.mainLocation.zipcode}` ??
                  '',
                TENANT_LOGO: tenant?.logo?.url ?? '',
                CUSTOMER_NAME: name,
                SENDER_NAME: smsSender(tenant?.emailSender),
                LINK: generatedLink,
              },
            },
            tenant?.id,
          );
        } catch (e) {
          handleError(
            'sendDocument',
            'Failed to send email to provided custom email',
            e,
          );
          errors.push('Failed to send email to provided custom email');
        }

        const payload = {
          recipient: subjectEmail,
          link: generatedLink,
        };

        try {
          await createActivityFromSendEvent(
            contact.id,
            'email',
            'form',
            JSON.stringify(payload),
            String(tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send email event',
            error,
          );
          errors.push('Failed to create activity from send email event');
        }
      }

      if (subjectPhone) {
        const name = getFirstName(contact?.fullName);
        const defaultMessage = `Hello ${name}, please fill out the form below \n${smsSender(
          tenant?.emailSender,
        )} \n${generatedLink}`;
        try {
          const twilioClient = new TwilioService(
            '',
            twilioConnection[0].accountSid,
          );
          await twilioClient.sendSMS({
            body: customSmsSubjectContent
              ? customSmsSubjectContent.replace(/{{link}}/g, generatedLink)
              : defaultMessage,
            clientNumber: subjectPhone,
            twilioNumber: twilioConnection[0].phoneNumber,
          });
        } catch (e) {
          handleError(
            'sendDocument',
            'Failed to send SMS to provided phone number',
            e,
          );
          errors.push('Failed to send SMS to provided phone number');
        }

        const payload = {
          recipient: subjectPhone,
          link: generatedLink,
        };

        try {
          await createActivityFromSendEvent(
            contact.id,
            'sms',
            'form',
            JSON.stringify(payload),
            String(tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
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
  }
  if (docType === 'appraisal') {
    let twilioConnection;
    const document = await strapi.entityService.findOne(
      'api::appraisal.appraisal',
      templateId,
      {
        populate: [
          'pdf',
          'tenant',
          'tenant.logo',
          'tenant.mainLocation',
          'contact',
        ],
      },
    );
    const firstName = getFirstName(document?.contact?.fullName);
    const defaultMessage = `Hello ${firstName}, please find your appraisal below \n${smsSender(
      document?.tenant?.emailSender,
    )} \n${document?.pdf?.url}`;

    if (sendBySms || subjectPhone) {
      try {
        twilioConnection = await strapi.entityService.findMany(
          'api::twilio-connection.twilio-connection',
          {
            filters: { tenant: { id: { $eq: document.tenant.id } } },
          },
        );
      } catch (e) {
        handleError('sendDocument', 'Failed to fetch twilio connection', e);
        errors.push('Failed to fetch twilio connection');
      }
    }

    if (contactId) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
      );

      if (sendByEmail) {
        try {
          await sendEmail(
            {
              meta: {
                to: contact.email,
                from: emailSender(document?.tenant?.emailSender),
                replyTo: emailReplyTo(document?.tenant?.email),
              },
              templateData: {
                templateReferenceId: 13,
              },
              variables: {
                LINK: document?.pdf?.url,
                COMPANY_NAME: document?.tenant?.companyName ?? '',
                TENANT_LOGO: document?.tenant?.logo?.url ?? '',
                SENDER_NAME: smsSender(document?.tenant?.emailSender),
                USER_NAME: `${firstName}`,
                TENANT_LOCATION:
                  `${document?.tenant?.mainLocation?.address}, ${document?.tenant?.mainLocation?.zipcode}` ??
                  '',
              },
            },
            document?.tenant?.id,
          );
        } catch (e) {
          errors.push('Failed to send email to provided contact');
          handleError(
            'sendDocument',
            'Failed to send email to provided contact',
          );
          handleError(
            'sendDocument',
            'Failed to send email to provided contact',
          );
        }

        const payload = {
          recipient: contact.email,
          link: document?.pdf?.url,
        };

        try {
          await createActivityFromSendEvent(
            String(contact.id),
            'email',
            'appraisal',
            JSON.stringify(payload),
            String(document?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send email event',
            error,
          );
          errors.push('Failed to create activity from send email event');
        }
      }

      if (sendBySms) {
        try {
          const twilioClient = new TwilioService(
            '',
            twilioConnection[0].accountSid,
          );
          await twilioClient.sendSMS({
            body: customSmsContactContent
              ? customSmsContactContent.replace(/{{link}}/g, document?.pdf?.url)
              : defaultMessage,
            clientNumber: contact.phoneNumber,
            twilioNumber: twilioConnection[0].phoneNumber,
          });
        } catch (e) {
          errors.push('Failed to send SMS to provided contact');
          handleError('sendDocument', 'Failed to send SMS to provided contact');
        }

        const payload = {
          recipient: contact.phoneNumber,
          link: document?.pdf?.url,
        };

        try {
          await createActivityFromSendEvent(
            String(contact.id),
            'sms',
            'appraisal',
            JSON.stringify(payload),
            String(document?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send sms event',
            error,
          );
          errors.push('Failed to create activity from send sms event');
        }
      }
    }
    if (subjectEmail) {
      try {
        await sendEmail(
          {
            meta: {
              to: subjectEmail,
              from: emailSender(document?.tenant?.emailSender),
              replyTo: emailReplyTo(document?.tenant?.email),
            },
            templateData: {
              templateReferenceId: 13,
            },
            variables: {
              LINK: document?.pdf?.url,
              COMPANY_NAME: document?.tenant?.companyName,
              TENANT_LOGO: document?.tenant?.logo?.url,
              SENDER_NAME: smsSender(document?.tenant?.emailSender),
              USER_NAME: firstName ?? '',
              TENANT_LOCATION:
                `${document?.tenant?.mainLocation?.address}, ${document?.tenant?.mainLocation?.zipcode}` ??
                '',
            },
          },
          document?.tenant?.id,
        );
      } catch (e) {
        errors.push('Failed to send email to provided custom email');
        handleError(
          'sendDocument',
          'Failed to send email to provided custom email',
        );
      }

      if (document?.contact?.id) {
        const payload = {
          recipient: subjectEmail,
          link: document?.pdf?.url,
        };

        try {
          await createActivityFromSendEvent(
            String(document?.contact?.id),
            'email',
            'appraisal',
            JSON.stringify(payload),
            String(document?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send email event',
            error,
          );
          errors.push('Failed to create activity from send email event');
        }
      }
    }

    if (subjectPhone) {
      try {
        const twilioClient = new TwilioService(
          '',
          twilioConnection[0].accountSid,
        );
        await twilioClient.sendSMS({
          body: customSmsSubjectContent
            ? customSmsSubjectContent.replace(/{{link}}/g, document?.pdf?.url)
            : defaultMessage,
          clientNumber: subjectPhone,
          twilioNumber: twilioConnection[0].phoneNumber,
        });
      } catch (e) {
        errors.push('Failed to send SMS to provided phone number');
        handleError(
          'sendDocument',
          'Failed to send SMS to provided phone number',
        );
      }

      if (document?.contact?.id) {
        const payload = {
          recipient: subjectPhone,
          link: document?.pdf?.url,
        };

        try {
          await createActivityFromSendEvent(
            String(document?.contact?.id),
            'sms',
            'appraisal',
            JSON.stringify(payload),
            String(document?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
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
  }
  if (docType === 'shipment') {
    let twilioConnection;
    const shipment = await strapi.entityService.findOne(
      'api::shipment.shipment',
      templateId,
      {
        populate: [
          'order',
          'tenant',
          'contact',
          'order.tenant',
          'order.tenant.mainLocation',
        ],
      },
    );

    const firstName = getFirstName(shipment?.contact?.fullName);
    const defaultMessage = `Hi ${firstName}, just wanted to let you know that your order ${shipment
      ?.order?.orderId} has been shipped ${
      shipment?.trackingNumber
        ? `and its tracking number is ${shipment?.trackingNumber}`
        : ''
    } \n${smsSender(shipment?.order?.tenant?.emailSender)}`;

    if (sendBySms || subjectPhone) {
      try {
        twilioConnection = await strapi.entityService.findMany(
          'api::twilio-connection.twilio-connection',
          {
            filters: { tenant: { id: { $eq: shipment?.order?.tenant?.id } } },
          },
        );
      } catch (e) {
        handleError('sendDocument', 'Failed to fetch twilio connection', e);
        errors.push('Failed to fetch twilio connection');
      }
    }

    if (contactId) {
      const contact = await strapi.entityService.findOne(
        'api::contact.contact',
        contactId,
      );

      if (sendByEmail) {
        try {
          await sendEmail(
            {
              meta: {
                to: contact.email,
                from: emailSender(shipment?.order?.tenant?.emailSender),
                replyTo: emailReplyTo(shipment?.order?.tenant?.email),
              },
              templateData: {
                templateReferenceId: 20,
              },
              variables: {
                ORDER_ID: shipment?.order?.orderId ?? '',
                TRACKING_NUMBER: shipment?.trackingNumber ?? '',
                COMPANY_NAME: shipment?.order?.tenant?.companyName ?? '',
                TENANT_LOGO: shipment?.order?.tenant?.logo?.url ?? '',
                EMAIL_SENDER: smsSender(shipment?.order?.tenant?.emailSender),
                USER_NAME: `${firstName ?? ''}`,
                TENANT_LOCATION:
                  `${shipment?.order?.tenant?.mainLocation?.address}, ${shipment?.order?.tenant?.mainLocation?.zipcode}` ??
                  '',
              },
            },
            shipment?.order?.tenant?.id,
          );
        } catch (e) {
          errors.push('Failed to send email to provided contact');
          handleError(
            'sendDocument',
            'Failed to send email to provided contact',
          );
        }

        const payload = {
          recipient: contact.email,
          id: shipment?.order?.id,
        };

        try {
          await createActivityFromSendEvent(
            String(contact?.id),
            'email',
            'shipment',
            JSON.stringify(payload),
            String(shipment?.order?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send email event',
            error,
          );
          errors.push('Failed to create activity from send email event');
        }
      }

      if (sendBySms) {
        try {
          const twilioClient = new TwilioService(
            '',
            twilioConnection[0].accountSid,
          );
          await twilioClient.sendSMS({
            body: customSmsContactContent
              ? customSmsContactContent
              : defaultMessage,
            clientNumber: contact.phoneNumber,
            twilioNumber: twilioConnection[0].phoneNumber,
          });
        } catch (e) {
          errors.push('Failed to send SMS to provided contact');
          handleError('sendDocument', 'Failed to send SMS to provided contact');
        }

        const payload = {
          recipient: contact.phoneNumber,
          id: shipment?.order?.id,
        };

        try {
          await createActivityFromSendEvent(
            String(contact?.id),
            'sms',
            'shipment',
            JSON.stringify(payload),
            String(shipment?.order?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send sms event',
            error,
          );
          errors.push('Failed to create activity from send sms event');
        }
      }
    }

    if (subjectEmail) {
      try {
        await sendEmail(
          {
            meta: {
              to: subjectEmail,
              from: emailSender(shipment?.order?.tenant?.emailSender),
              replyTo: emailReplyTo(shipment?.order?.tenant?.email),
            },
            templateData: {
              templateReferenceId: 20,
            },
            variables: {
              ORDER_ID: shipment?.order?.orderId ?? '',
              TRACKING_NUMBER: shipment?.trackingNumber ?? '',
              COMPANY_NAME: shipment?.order?.tenant?.companyName ?? '',
              TENANT_LOGO: shipment?.order?.tenant?.logo?.url ?? '',
              EMAIL_SENDER: smsSender(shipment?.order?.tenant?.emailSender),
              USER_NAME: `${firstName ?? ''}`,
              TENANT_LOCATION:
                `${shipment?.order?.tenant?.mainLocation?.address}, ${shipment?.order?.tenant?.mainLocation?.zipcode}` ??
                '',
            },
          },
          shipment?.order?.tenant?.id,
        );
      } catch (e) {
        errors.push('Failed to send email to provided custom email');
        handleError(
          'sendDocument',
          'Failed to send email to provided custom email',
        );
      }

      if (shipment?.contact?.id) {
        const payload = {
          recipient: subjectEmail,
          id: shipment?.order?.id,
        };

        try {
          await createActivityFromSendEvent(
            String(shipment?.contact?.id),
            'email',
            'shipment',
            JSON.stringify(payload),
            String(shipment?.order?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
            'Failed to create activity from send email event',
            error,
          );
          errors.push('Failed to create activity from send email event');
        }
      }
    }

    if (subjectPhone) {
      try {
        const twilioClient = new TwilioService(
          '',
          twilioConnection[0].accountSid,
        );
        await twilioClient.sendSMS({
          body: customSmsSubjectContent
            ? customSmsSubjectContent
            : defaultMessage,
          clientNumber: subjectPhone,
          twilioNumber: twilioConnection[0].phoneNumber,
        });
      } catch (e) {
        errors.push('Failed to send SMS to provided phone number');
        handleError(
          'sendDocument',
          'Failed to send SMS to provided phone number',
        );
      }

      if (shipment?.contact?.id) {
        const payload = {
          recipient: subjectPhone,
          id: shipment?.order?.id,
        };

        try {
          await createActivityFromSendEvent(
            String(shipment?.contact?.id),
            'sms',
            'shipment',
            JSON.stringify(payload),
            String(shipment?.order?.tenant?.id),
            'contact',
          );
        } catch (error) {
          handleError(
            'sendDocument',
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
  }
  return {
    success: false,
    errors: ['Invalid document type'],
  };
};
