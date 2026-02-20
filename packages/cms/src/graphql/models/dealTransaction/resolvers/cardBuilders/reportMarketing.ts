import { Any } from '@strapi/strapi/lib/services/entity-service/types/params/filters';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import {
  currentDate,
  dateRanges,
  filterPeriodBuilder,
  getTenantFilter,
} from '../../helpers/helpers';
export const getReportMarketingCardsInfo = async (
  userId,
  dates,
  additionalFilters = {},
) => {
  const marketingReportFilters = addDollarToFilterKeys(additionalFilters);

  const rangeFilters = dates
    ? {
        createdAt: {
          $between: [new Date(dates[0]), new Date(dates[1])],
        },
      }
    : {};

  const tenantFilter = await getTenantFilter(userId);
  const reportsInPeriod = await strapi.entityService.findMany(
    'api::marketing-customers-report.marketing-customers-report',
    {
      filters: {
        ...marketingReportFilters,
        ...tenantFilter,
        ...rangeFilters,
      } as Any<'api::marketing-customers-report.marketing-customers-report'>,
      fields: ['SMSsent', 'EMAILsent'],
    },
  );

  const reportsIn30Days = await strapi.entityService.findMany(
    'api::marketing-customers-report.marketing-customers-report',
    {
      filters: {
        ...marketingReportFilters,
        ...tenantFilter,
        ...filterPeriodBuilder(
          dateRanges?.thirtyDaysAgo.toISOString(),
          currentDate.toISOString(),
        ),
      } as Any<'api::marketing-customers-report.marketing-customers-report'>,
      fields: ['SMSsent', 'EMAILsent'],
    },
  );

  const SMSInPeriod = reportsInPeriod?.reduce(
    (summary, report) => summary + report?.SMSsent,
    0,
  );
  const EmailInPeriod = reportsInPeriod?.reduce(
    (summary, report) => summary + report?.EMAILsent,
    0,
  );
  const SMSInMonth = reportsIn30Days?.reduce(
    (summary, report) => summary + report?.SMSsent,
    0,
  );
  const EmailInMonth = reportsIn30Days?.reduce(
    (summary, report) => summary + report?.EMAILsent,
    0,
  );

  return [
    {
      id: 24,
      name: 'SMS in Period',
      total: SMSInPeriod ?? 0,
      cardImg: 1,
      type: 'employees',
    },
    {
      id: 25,
      name: 'Emails in Period',
      total: EmailInPeriod ?? 0,
      cardImg: 2,
      type: 'employees',
    },
    {
      id: 26,
      name: 'SMS in 30 days',
      total: SMSInMonth ?? 0,
      cardImg: 3,
      type: 'employees',
    },
    {
      id: 27,
      name: 'Emails in 30 days',
      total: EmailInMonth ?? 0,
      cardImg: 1,
      type: 'employees',
    },
  ];
};
