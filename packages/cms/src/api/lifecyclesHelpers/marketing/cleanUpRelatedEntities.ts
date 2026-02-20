import BeforeLifecycleEvent = Database.BeforeLifecycleEvent;

export const cleanUpRelatedEntities: BeforeLifecycleEvent = async ({
  params,
}) => {
  const campaignId = params?.where?.id;

  if (!campaignId) {
    throw new Error('Campaign ID is missing or invalid');
  }

  const campaignFilter = {
    filters: {
      campaign: {
        id: {
          $eq: campaignId,
        },
      },
    },
    fields: ['id'],
  } as any;

  const campaignSteps = await strapi.entityService.findMany(
    'api::sequence-step.sequence-step',
    {
      ...campaignFilter,
    },
  );

  const enrolledContacts = await strapi.entityService.findMany(
    'api::campaign-enrolled-contact.campaign-enrolled-contact',
    {
      ...campaignFilter,
    },
  );

  const enrolledLeads = await strapi.entityService.findMany(
    'api::campaign-enrolled-lead.campaign-enrolled-lead',
    {
      ...campaignFilter,
    },
  );

  const enrolledContactsConditions = await strapi.entityService.findMany(
    'api::enrolled-contact-condition.enrolled-contact-condition',
    {
      ...campaignFilter,
    },
  );

  const enrolledLeadsConditions = await strapi.entityService.findMany(
    'api::enrolled-lead-condition.enrolled-lead-condition',
    {
      ...campaignFilter,
    },
  );

  if (campaignSteps.length > 0) {
    await Promise.all(
      campaignSteps.map(async (step) => {
        await strapi.entityService.delete(
          'api::sequence-step.sequence-step',
          step.id,
        );
      }),
    );
  }

  if (enrolledContacts.length > 0) {
    await Promise.all(
      enrolledContacts.map(async (item) => {
        await strapi.entityService.delete(
          'api::campaign-enrolled-contact.campaign-enrolled-contact',
          item.id,
        );
      }),
    );
  }

  if (enrolledLeads.length > 0) {
    await Promise.all(
      enrolledLeads.map(async (lead) => {
        await strapi.entityService.delete(
          'api::campaign-enrolled-lead.campaign-enrolled-lead',
          lead.id,
        );
      }),
    );
  }

  if (enrolledContactsConditions.length > 0) {
    await Promise.all(
      enrolledContactsConditions.map(async (condition) => {
        await strapi.entityService.delete(
          'api::enrolled-contact-condition.enrolled-contact-condition',
          condition.id,
        );
      }),
    );
  }

  if (enrolledLeadsConditions.length > 0) {
    await Promise.all(
      enrolledLeadsConditions.map(async (condition) => {
        await strapi.entityService.delete(
          'api::enrolled-lead-condition.enrolled-lead-condition',
          condition.id,
        );
      }),
    );
  }
};
