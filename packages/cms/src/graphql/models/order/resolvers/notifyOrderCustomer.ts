import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import { GraphQLFieldResolver } from 'graphql';
import { NexusGenInputs } from '../../../../../src/types/generated/graphql';
import {
  createNotificationActivity,
  getContactDataFromOrder,
  getTenantData,
  isInvalidEmailDomain,
  sendEmailNotification,
  sendSmsNotification,
} from '../../../../api/lifecyclesHelpers/order/helpers';
import { type OrderContactData } from '../../../../api/lifecyclesHelpers/order/types';
import { getFirstName } from '../../../helpers/getFirstName';
import { getTenantFilter } from '../../dealTransaction/helpers/helpers';
import { smsSender } from '../../helpers/email';
import { handleError, handleLogger } from './../../../helpers/errors';

const LOG_PREFIX = 'notifyOrderCustomer';

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

const getTwilioConnection = async (tenantFilter: any) => {
  const twilioService = await strapi.service(
    'api::twilio-connection.twilio-connection',
  );

  const twilioConnections = await strapi.entityService.findMany(
    'api::twilio-connection.twilio-connection',
    {
      filters: { ...tenantFilter },
    },
  );

  return {
    twilioService,
    twilioConnection: twilioConnections?.[0],
  };
};

export const notifyOrderCustomer: GraphQLFieldResolver<
  any,
  Graphql.ResolverContext,
  { input: NexusGenInputs['NotifyOrderCustomerInput'] }
> = async (_, args, ctx) => {
  const {
    email,
    subjectEmail,
    subjectPhone,
    phoneNumber,
    customSmsSubjectContent,
    content,
    orderName,
    orderId,
  } = args.input;

  handleLogger(
    'info',
    `Resolver :: ${LOG_PREFIX}`,
    `Params: ${JSON.stringify(args.input)}`,
  );

  const tenantFilter = await getTenantFilter(ctx.state.user.id);
  const tenant = await getTenantData(tenantFilter?.tenant);
  let order = null;
  const errors: string[] = [];

  try {
    order = await strapi.entityService.findOne(
      'api::order.order',
      orderId as ID,
      {
        fields: ['status', 'type', 'orderId'],
        populate: ['contact', 'company'],
      },
    );
  } catch (error) {
    handleError('findOrderById', error);
    errors.push('Error searching for order');
  }

  if (order?.type !== 'sell') return { success: false, errors };

  if (order?.status !== 'ready' && order?.status !== 'shipped') {
    return { success: false, errors };
  }

  const contactData = getContactDataFromOrder(order);

  if (email && !isInvalidEmailDomain(email)) {
    await sendEmailNotification({
      email,
      orderName,
      content,
      tenant,
      contactName: contactData.firstName,
      contactData,
      orderId: order?.id,
      errors,
      logPrefix: LOG_PREFIX,
    });
  }

  if (subjectEmail && !isInvalidEmailDomain(subjectEmail)) {
    await sendEmailNotification({
      email: subjectEmail,
      orderName,
      content,
      tenant,
      contactName: contactData.firstName,
      contactData,
      orderId: order?.id,
      errors,
      logPrefix: LOG_PREFIX,
    });
  }

  if (phoneNumber || subjectPhone) {
    let twilioService;
    let twilioConnection;

    try {
      const result = await getTwilioConnection(tenantFilter);
      twilioService = result.twilioService;
      twilioConnection = result.twilioConnection;
    } catch (error) {
      handleError(LOG_PREFIX, error);
      errors.push('Error getting twilio connection');
    }

    if (twilioConnection?.id) {
      const defaultMessage = `Great news ${
        contactData.firstName
      }! Your order ${order?.orderId} is ready to be picked up. If you have any questions please feel free to reach out.\n${smsSender(
        tenant?.emailSender,
      )}`;

      if (phoneNumber) {
        const preparedContent =
          content && content.includes('{{')
            ? await getTargetContent(content, contactData)
            : content;

        await sendSmsNotification({
          twilioService,
          twilioConnectionId: twilioConnection.id.toString(),
          phoneNumber,
          message: content !== '' ? preparedContent : defaultMessage,
          errors,
          logPrefix: LOG_PREFIX,
        });

        await createNotificationActivity({
          recipient: phoneNumber,
          type: 'sms',
          contactData,
          tenantId: tenant.id,
          orderId: order?.id,
          errors,
          logPrefix: LOG_PREFIX,
        });
      }

      if (subjectPhone) {
        const preparedSubjectContent =
          customSmsSubjectContent && customSmsSubjectContent.includes('{{')
            ? await getTargetContent(customSmsSubjectContent, contactData)
            : customSmsSubjectContent;

        await sendSmsNotification({
          twilioService,
          twilioConnectionId: twilioConnection.id.toString(),
          phoneNumber: subjectPhone,
          message: customSmsSubjectContent
            ? preparedSubjectContent
            : defaultMessage,
          errors,
          logPrefix: LOG_PREFIX,
        });

        await createNotificationActivity({
          recipient: subjectPhone,
          type: 'sms',
          contactData,
          tenantId: tenant.id,
          orderId: order?.id,
          errors,
          logPrefix: LOG_PREFIX,
        });
      }
    }
  }

  return {
    success: true,
    errors,
  };
};
