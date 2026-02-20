import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { handleError } from '../../../../graphql/helpers/errors';
import {
  emailReplyTo,
  emailSender,
  smsSender,
} from '../../../../graphql/models/helpers/email';
import { sendEmail } from '../../../email/sendEmail';
import { OrderContactData } from '../types';
import { createNotificationActivity } from './createNotificationActivity';

export const sendEmailNotification = async (params: {
  email: string;
  orderName: string;
  content: string;
  tenant: any;
  contactName: string;
  contactData: OrderContactData;
  orderId?: ID;
  errors?: string[];
  logPrefix?: string;
}) => {
  const {
    email,
    orderName,
    content,
    tenant,
    contactName,
    contactData,
    orderId,
    errors,
    logPrefix = 'sendEmailNotification',
  } = params;

  try {
    await sendEmail(
      {
        meta: {
          to: email,
          from: emailSender(tenant?.emailSender),
          replyTo: emailReplyTo(tenant?.email),
        },
        templateData: { templateReferenceId: 15 },
        variables: {
          TASK_NAME: orderName,
          TASK_CONTENT: content,
          TENANT: tenant?.companyName,
          TENANT_LOGO: tenant?.logo?.url,
          USER_NAME: contactName ?? 'Client',
          SENDER_NAME: smsSender(tenant?.emailSender) ?? '',
          TENANT_LOCATION: `${tenant?.mainLocation?.address ?? ''}, ${
            tenant?.mainLocation?.zipcode ?? ''
          }`,
        },
      },
      tenant?.id,
    );
  } catch (error) {
    handleError(`${logPrefix}:sendEmail`, error);
    errors?.push('Error sending email');
  }

  await createNotificationActivity({
    recipient: email,
    type: 'email',
    contactData,
    tenantId: tenant?.id,
    orderId,
    errors,
    logPrefix,
  });
};
