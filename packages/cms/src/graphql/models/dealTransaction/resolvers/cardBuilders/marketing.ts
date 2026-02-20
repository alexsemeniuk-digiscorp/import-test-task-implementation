import { getTenantFilter } from './../../helpers/helpers';

export const getMarketingCardsInfo = async (userId) => {
  const tenantFilter = await getTenantFilter(userId);
  const campaigns = await strapi.entityService.findMany(
    'api::campaign.campaign',
    {
      filters: {
        ...tenantFilter,
      },
      fields: ['id', 'isActive'],
    },
  );

  const enrolledContacts = await strapi.entityService.findMany(
    'api::campaign-enrolled-contact.campaign-enrolled-contact',
    {
      filters: {
        ...tenantFilter,
      },
      fields: ['id', 'isUnsubscribed'],
    },
  );
  const enrolledLeads = await strapi.entityService.findMany(
    'api::campaign-enrolled-lead.campaign-enrolled-lead',
    {
      filters: {
        ...tenantFilter,
      },
      fields: ['id', 'isUnsubscribed'],
    },
  );

  const unsubscribedContacts =
    Number(
      enrolledContacts.filter((contact) => !!contact.isUnsubscribed).length,
    ) + Number(enrolledLeads.filter((lead) => !!lead.isUnsubscribed).length);

  const activeCampaigns = campaigns.filter((campaign) => campaign.isActive);

  return [
    {
      id: 100,
      name: 'Number of Campaigns',
      total: Number(campaigns.length),
      cardImg: 1,
    },
    {
      id: 101,
      name: 'Active Campaigns',
      total: Number(activeCampaigns.length),
      cardImg: 2,
    },
    {
      id: 102,
      name: 'Contacts Enrolled',
      total: Number(enrolledContacts.length) + Number(enrolledLeads.length),
      cardImg: 3,
    },
    {
      id: 103,
      name: 'Contacts Unsubscribed',
      total: Number(unsubscribedContacts),
      cardImg: 2,
    },
  ];
};
