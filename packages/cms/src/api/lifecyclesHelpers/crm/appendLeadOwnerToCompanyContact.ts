import { LifecycleHook } from '../types';

export const appendLeadOwnerToCompanyContact: LifecycleHook = async ({
  result,
  params,
}) => {
  // Skip append lead owner to company contact during bulk imports for performance
  if (params?.data?._skipAppendLeadOwnerToCompanyContact) {
    delete params?.data?._skipAppendLeadOwnerToCompanyContact;
    return;
  }

  const { id } = result;
  const { leadOwner: newLeadOwnerId } = params.data;

  if (newLeadOwnerId) {
    const companyContacts = await strapi.entityService.findMany(
      'api::contact.contact',
      {
        filters: {
          company: id,
        },
        fields: ['id'],
        populate: {
          leadOwner: {
            fields: ['id'],
          },
        },
      },
    );

    await Promise.all(
      companyContacts.map(async (companyContact) => {
        if (!companyContact?.leadOwner) {
          await strapi.entityService.update(
            'api::contact.contact',
            companyContact.id,
            {
              data: {
                leadOwner: newLeadOwnerId,
              },
            },
          );
        }
      }),
    );
  }
};
