import { NexusGenEnums } from '../../../../../../../types/generated/graphql';
import { handleError } from './../../../../../../helpers/errors';

export const addPurchaseActivity = async ({
  isCompany,
  isContact,
  customerId,
  dueDate,
  tenant,
  customDate,
  orderId,
  type,
  status,
  total,
}) => {
  try {
    const isCompanyORContact = isCompany || isContact;

    const orderType =
      (type === 'sell' || type === 'layaway') && status !== 'draft';

    if (isCompanyORContact && orderType) {
      await strapi.entityService.create('api::activity.activity', {
        data: {
          title: 'Purchase',
          customCreationDate: customDate,
          due_date: dueDate ?? customDate ?? new Date(),
          contact_id: isContact ? customerId : undefined,
          company_id: isCompany ? customerId : undefined,
          amount: total,
          completed: true,
          description: ``,
          notes: ``,
          type: 'purchase' as NexusGenEnums['ENUM_ACTIVITY_TYPE'],
          tenant,
          order: orderId,
          _skipMeilisearchSync: true,
        },
      });
    }
  } catch (e) {
    handleError('addPurchaseActivity', undefined, e);
  }
};
