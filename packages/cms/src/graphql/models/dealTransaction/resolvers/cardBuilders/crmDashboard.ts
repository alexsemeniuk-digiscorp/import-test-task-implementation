import {
  calculatePercentageChange,
  currentDate,
  dateRanges,
  getStartOfWeek,
  getTenantFilter,
  getWeekRange,
} from './../../helpers/helpers';

export const getCrmDashboardCardsInfo = async (userId) => {
  const tenantFilter = await getTenantFilter(userId);
  const endOfSamePeriodInPrevWeek = getWeekRange();
  const startOfPreviousWeek = getStartOfWeek(endOfSamePeriodInPrevWeek);

  const contactsTotal = await strapi.entityService.count(
    'api::contact.contact',
    {
      filters: { ...tenantFilter },
    },
  );

  const lastWeekContactsTotal = await strapi.entityService.count(
    'api::contact.contact',
    {
      filters: {
        ...tenantFilter,
        customCreationDate: {
          $between: [getStartOfWeek().toISOString(), currentDate.toISOString()],
        },
      },
    },
  );

  const prevWeekContactsTotal = await strapi.entityService.count(
    'api::contact.contact',
    {
      filters: {
        ...tenantFilter,
        customCreationDate: {
          $between: [startOfPreviousWeek.toISOString(), getWeekRange()],
        },
      },
    },
  );

  const lastMonthContactsTotal = await strapi.entityService.count(
    'api::contact.contact',
    {
      filters: {
        ...tenantFilter,
        customCreationDate: {
          $between: [
            dateRanges.beginningOfThisMonth.toISOString(),
            currentDate.toISOString(),
          ],
        },
      },
    },
  );

  const prevMonthContactsTotal = await strapi.entityService.count(
    'api::contact.contact',
    {
      filters: {
        ...tenantFilter,
        customCreationDate: {
          $between: [
            dateRanges.beginningOfPrevMonth.toISOString(),
            dateRanges.beginningOfThisMonth.toISOString(),
          ],
        },
      },
    },
  );

  const weekOverWeekChange = calculatePercentageChange(
    prevWeekContactsTotal,
    lastWeekContactsTotal,
  );
  const monthOverMonthChange = calculatePercentageChange(
    prevMonthContactsTotal,
    lastMonthContactsTotal,
  );

  return [
    {
      id: 203,
      name: 'Total Contacts',
      total: contactsTotal,
      cardImg: 1,
      percentage: weekOverWeekChange,
      description: 'vs Last Month',
    },
    {
      id: 204,
      name: 'Weekly New Contacts',
      total: lastWeekContactsTotal,
      percentage: monthOverMonthChange,
      description: 'vs Last Week',
      cardImg: 2,
    },
  ];
};
