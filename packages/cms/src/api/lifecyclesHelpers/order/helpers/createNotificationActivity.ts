import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';
import createActivityFromSendEvent from '../../../../graphql/helpers/createContactActivityFromSendEvent';
import { handleError } from '../../../../graphql/helpers/errors';
import { OrderContactData } from '../types';

export const resolveActivityTarget = (
  contactData: OrderContactData,
): { id: string; type: 'contact' | 'lead' | 'company' } | null =>
  contactData?.contact?.id
    ? { id: String(contactData.contact.id), type: 'contact' as const }
    : contactData?.lead?.id
    ? { id: String(contactData.lead.id), type: 'lead' as const }
    : contactData?.company?.id
    ? { id: String(contactData.company.id), type: 'company' as const }
    : null;

export const createNotificationActivity = async (params: {
  recipient: string;
  type: 'email' | 'sms';
  contactData: OrderContactData;
  tenantId: ID;
  orderId?: ID;
  errors?: string[];
  logPrefix?: string;
}) => {
  const {
    recipient,
    type,
    contactData,
    tenantId,
    orderId,
    errors,
    logPrefix = 'createNotificationActivity',
  } = params;

  const payload = {
    recipient,
    ...(orderId && { order: orderId }),
  };

  try {
    const target = resolveActivityTarget(contactData);
    if (target) {
      await createActivityFromSendEvent(
        target.id,
        type,
        'task',
        JSON.stringify(payload),
        String(tenantId),
        target.type,
      );
    }
  } catch (error) {
    handleError(
      logPrefix,
      `Failed to create activity from send ${type} event`,
      error,
    );
    errors?.push(`Failed to create activity from send ${type} event`);
  }
};
