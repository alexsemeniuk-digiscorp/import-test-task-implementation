import { handleError, handleLogger } from '../../../graphql/helpers/errors';
import { smsSender } from '../../../graphql/models/helpers/email';
import {
  createNotificationActivity,
  getContactDataFromOrder,
  getTenantData,
  isInvalidEmailDomain,
  sendAutoReviewRequest,
  sendEmailNotification,
  sendSmsNotification,
} from './helpers';

const LOG_PREFIX = 'notifyCustomerOnReadyOrShipped';

export const notifyCustomerOnReadyOrShipped = async (order, previousStatus) => {
  strapi.log.info(
    `[${LOG_PREFIX}] Called with order type: ${order?.type}, status: ${order?.status}, previousStatus: ${previousStatus}`,
  );

  if (order?.type !== 'sell') {
    strapi.log.info(`[${LOG_PREFIX}] Skipping - order type is not 'sell'`);
    return;
  }

  if (order?.status !== 'ready' && order?.status !== 'shipped') {
    strapi.log.info(
      `[${LOG_PREFIX}] Skipping - order status is not 'ready' or 'shipped'`,
    );
    return;
  }

  if (!order?.tenant?.id) {
    handleLogger(
      'warn',
      LOG_PREFIX,
      'Order has no tenant, skipping notification',
    );
    return;
  }

  const orderSettings = await strapi.entityService.findMany(
    'api::order-setting.order-setting',
    {
      filters: {
        tenant: {
          id: {
            $eq: order.tenant.id,
          },
        },
      },
      fields: ['isAutoSendNotification', 'isAutoSendReview'],
    },
  );

  const orderSetting = orderSettings?.[0];

  if (!orderSetting) {
    strapi.log.info(
      `[${LOG_PREFIX}] Skipping - there are no order settings for this tenant`,
    );
    return;
  }

  if (order?.status === 'shipped' && orderSetting?.isAutoSendReview !== false) {
    strapi.log.info(`[${LOG_PREFIX}] Calling sendAutoReviewRequest`);
    await sendAutoReviewRequest(order);
  }

  if (previousStatus === 'draft') {
    strapi.log.info(
      `[${LOG_PREFIX}] Skipping - previous order status is 'draft'`,
    );
    return;
  }

  const notifiableStatuses = ['ready', 'shipped'];
  if (
    previousStatus &&
    notifiableStatuses.includes(previousStatus) &&
    notifiableStatuses.includes(order?.status)
  ) {
    strapi.log.info(
      `[${LOG_PREFIX}] Skipping notification - already notified (previous status was also ready/shipped)`,
    );
    return;
  }

  if (orderSetting?.isAutoSendNotification === false) {
    return;
  }

  const contactData = getContactDataFromOrder(order);
  const email = contactData.contact?.email || contactData.company?.email;
  const phoneNumber =
    contactData.contact?.phoneNumber || contactData.company?.phoneNumber;

  if (!email && !phoneNumber) {
    handleLogger(
      'info',
      LOG_PREFIX,
      'No email or phone number found for order, skipping notification',
    );
    return;
  }

  const tenant = await getTenantData(order.tenant.id);
  const orderName = `Order ${order.orderId}`;
  const statusMessage =
    order.status === 'shipped' ? 'has been shipped' : 'is ready for pickup';
  const content = `Your order ${order.orderId} ${statusMessage}. Thank you for your business!`;

  handleLogger(
    'info',
    LOG_PREFIX,
    `Sending notification for order ${order.orderId} - status: ${order.status}`,
  );

  if (email && !isInvalidEmailDomain(email)) {
    await sendEmailNotification({
      email,
      orderName,
      content,
      tenant,
      contactName: contactData.firstName,
      contactData,
      orderId: order.id,
      logPrefix: LOG_PREFIX,
    });
  }

  if (phoneNumber) {
    try {
      const twilioService = await strapi.service(
        'api::twilio-connection.twilio-connection',
      );

      const twilioConnections = await strapi.entityService.findMany(
        'api::twilio-connection.twilio-connection',
        {
          filters: {
            tenant: {
              id: {
                $eq: order.tenant.id,
              },
            },
          },
        },
      );

      const twilioConnection = twilioConnections?.[0];

      if (twilioConnection?.id) {
        const smsMessage = `Great news ${contactData.firstName}! Your order ${
          order.orderId
        } ${statusMessage}. If you have any questions please feel free to reach out.\n${smsSender(
          tenant?.emailSender,
        )}`;

        await sendSmsNotification({
          twilioService,
          twilioConnectionId: twilioConnection.id.toString(),
          phoneNumber,
          message: smsMessage,
          logPrefix: LOG_PREFIX,
        });

        await createNotificationActivity({
          recipient: phoneNumber,
          type: 'sms',
          contactData,
          tenantId: tenant.id,
          orderId: order.id,
          logPrefix: LOG_PREFIX,
        });
      }
    } catch (error) {
      handleError(LOG_PREFIX, 'Error getting twilio connection', error);
    }
  }
};
