import createActivityFromSendEvent from '../../../../graphql/helpers/createContactActivityFromSendEvent';
import { handleError, handleLogger } from '../../../../graphql/helpers/errors';
import { getFirstName } from '../../../../graphql/helpers/getFirstName';
import {
  emailReplyTo,
  emailSender,
  smsSender,
} from '../../../../graphql/models/helpers/email';
import { sendEmail } from '../../../email/sendEmail';
import { OrderContactData } from '../types';
import { getContactDataFromOrder } from './getContactDataFromOrder';
import { isInvalidEmailDomain } from './isInvalidEmailDomain';

const LOG_PREFIX = 'sendAutoReviewRequest';

const getLastNamePortion = (fullName?: string, firstName?: string): string => {
  if (!fullName || !firstName) return '';
  return fullName.replace(firstName, '').trim();
};

const getTargetContent = async (
  content: string,
  contactData?: OrderContactData,
) => {
  if (!content) return content;

  const contactFullName =
    contactData?.contact?.fullName || contactData?.company?.name || '';
  const contactFirstName = getFirstName(contactFullName);

  const mergeData: Record<string, string | number> = {
    firstName:
      contactFirstName ||
      contactData?.contact?.firstName ||
      contactData?.company?.name ||
      '',
    lastName:
      contactData?.contact?.lastName ||
      getLastNamePortion(contactFullName, contactFirstName) ||
      '',
    fullName: contactFullName,
    email: contactData?.contact?.email || contactData?.company?.email || '',
    phoneNumber:
      contactData?.contact?.phoneNumber ||
      contactData?.company?.phoneNumber ||
      '',
    birthdayDate: contactData?.contact?.birthdayDate || '',
    address:
      contactData?.contact?.address || contactData?.company?.address || '',
    points: contactData?.contact?.points || contactData?.company?.points || 0,
  };

  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = mergeData[key];
    return value !== undefined && value !== null ? String(value) : match;
  });
};

const getSmsMessageContent = async (
  notificationSetting: any,
  firstName: string,
  orderUrl: string,
  senderName: string,
  contactData: OrderContactData,
) => {
  if (notificationSetting?.content) {
    const content = await getTargetContent(
      notificationSetting.content,
      contactData,
    );
    return content.replace(/\{\{link\}\}/g, orderUrl);
  }

  return `Thank you for your recent purchase ${firstName}!\nWe would greatly appreciate it if you could leave us a review using the link below \n${orderUrl}\n${senderName}`;
};

export const sendAutoReviewRequest = async (order: any) => {
  strapi.log.info(
    `[${LOG_PREFIX}] Starting - order id: ${order?.id}, orderId: ${order?.orderId}`,
  );

  if (!order?.id) {
    strapi.log.warn(`[${LOG_PREFIX}] Order ID is not available`);
    return;
  }

  const fullOrder = await strapi.entityService.findOne(
    'api::order.order',
    order.id,
    {
      populate: ['businessLocation', 'tenant', 'tenant.logo', 'contact'],
    },
  );

  if (!fullOrder) {
    strapi.log.error(`[${LOG_PREFIX}] Order is not available`);
    return;
  }

  const notificationSettings = await strapi.entityService.findMany(
    'api::setting-notification.setting-notification',
    {
      filters: {
        tenant: {
          id: {
            $eq: fullOrder.tenant.id,
          },
        },
        type: 'order',
      },
      fields: ['smsNotifyOnComplete', 'emailNotifyOnComplete', 'content'],
    },
  );

  const notificationSetting = notificationSettings?.[0];

  strapi.log.info(
    `[${LOG_PREFIX}] Notification settings: sms=${notificationSetting?.smsNotifyOnComplete}, email=${notificationSetting?.emailNotifyOnComplete}, hasContent=${!!notificationSetting?.content}`,
  );

  if (
    !notificationSetting ||
    (!notificationSetting?.smsNotifyOnComplete &&
      !notificationSetting?.emailNotifyOnComplete)
  ) {
    strapi.log.info(
      `[${LOG_PREFIX}] No notification settings or both SMS and email are disabled, skipping auto review request`,
    );
    return;
  }

  const orderUrl = `${process.env.FRONTEND_URL}/review?orderId=${fullOrder.orderId}`;
  const contactData = getContactDataFromOrder(fullOrder);
  const email = contactData.contact?.email || contactData.company?.email;
  const phoneNumber =
    contactData.contact?.phoneNumber || contactData.company?.phoneNumber;

  if (!email && !phoneNumber) {
    handleLogger(
      'info',
      LOG_PREFIX,
      'No email or phone number found for order, skipping auto review request',
    );
    return;
  }

  const firstName = contactData.firstName;
  const senderName = smsSender(fullOrder?.tenant?.emailSender);

  const sendEmailNotification = async () => {
    if (
      !notificationSetting?.emailNotifyOnComplete ||
      !email ||
      isInvalidEmailDomain(email)
    ) {
      return;
    }

    try {
      await sendEmail(
        {
          meta: {
            to: email,
            from: emailSender(fullOrder?.tenant?.emailSender),
            replyTo: emailReplyTo(fullOrder?.tenant?.email),
          },
          templateData: {
            templateReferenceId: 17,
          },
          variables: {
            TENANT_LOGO: fullOrder.tenant?.logo?.url ?? '',
            CUSTOMER_NAME: firstName,
            URL: orderUrl,
            SENDER_NAME: senderName,
          },
        },
        fullOrder?.tenant?.id,
      );

      handleLogger(
        'info',
        LOG_PREFIX,
        `Auto review email sent to ${email} for order ${fullOrder.orderId}`,
      );

      const contactId = contactData.contact?.id || contactData.company?.id;
      if (contactId) {
        const payload = {
          recipient: email,
          link: orderUrl,
          orderId: fullOrder.orderId,
          order: fullOrder.id,
        };

        try {
          await createActivityFromSendEvent(
            String(contactId),
            'email',
            'review',
            JSON.stringify(payload),
            String(fullOrder.tenant.id),
            contactData.contact?.id ? 'contact' : 'company',
          );
        } catch (error) {
          handleError(
            LOG_PREFIX,
            'Failed to create activity from send email event',
            error,
          );
        }
      }
    } catch (error) {
      handleError(
        LOG_PREFIX,
        `Failed to send auto review email to ${email}`,
        error,
      );
    }
  };

  const sendSmsNotification = async () => {
    if (!notificationSetting?.smsNotifyOnComplete || !phoneNumber) {
      return;
    }

    try {
      const twilioConnections = await strapi.entityService.findMany(
        'api::twilio-connection.twilio-connection',
        {
          filters: {
            tenant: {
              id: {
                $eq: fullOrder.tenant.id,
              },
            },
          },
        },
      );

      const twilioConnection = twilioConnections?.[0];

      if (twilioConnection?.id) {
        const twilioService = await strapi.service(
          'api::twilio-connection.twilio-connection',
        );

        const smsMessage = await getSmsMessageContent(
          notificationSetting,
          firstName,
          orderUrl,
          senderName,
          contactData,
        );

        await twilioService.sendSMS(
          twilioConnection.id.toString(),
          phoneNumber,
          smsMessage,
        );

        const contactId = contactData.contact?.id || contactData.company?.id;
        if (contactId) {
          const payload = {
            recipient: phoneNumber,
            link: orderUrl,
            orderId: fullOrder.orderId,
            order: fullOrder.id,
          };

          try {
            await createActivityFromSendEvent(
              String(contactId),
              'sms',
              'review',
              JSON.stringify(payload),
              String(fullOrder.tenant.id),
              contactData.contact?.id ? 'contact' : 'company',
            );
          } catch (error) {
            handleError(
              LOG_PREFIX,
              'Failed to create activity from send sms event',
              error,
            );
          }
        }
      } else {
        handleLogger(
          'warn',
          LOG_PREFIX,
          'No Twilio connection found for tenant, skipping SMS',
        );
      }
    } catch (error) {
      handleError(
        LOG_PREFIX,
        `Failed to send auto review SMS to ${phoneNumber}`,
        error,
      );
    }
  };

  await Promise.allSettled([sendEmailNotification(), sendSmsNotification()]);
};
