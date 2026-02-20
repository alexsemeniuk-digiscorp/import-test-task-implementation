/**
 * tax-report service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::tax-report.tax-report',
  ({ strapi }) => {
    return {
      async getAmountTaxCollected(id: number) {
        const taxReport = await strapi.entityService.findOne(
          'api::tax-report.tax-report',
          id,
          {
            populate: ['dealTransaction', 'order'],
          },
        );

        return taxReport?.dealTransaction?.paid || taxReport?.order?.tax;
      },
      async getTotalSummaryTaxCollected(dates?: Date[]) {
        const rangeFilters = dates
          ? {
              createdAt: {
                $between: [dates[0]?.toISOString(), dates[1]?.toISOString()],
              },
            }
          : {};

        const taxReports = await strapi.entityService.findMany(
          'api::tax-report.tax-report',
          {
            filters: {
              order: {
                ...rangeFilters,
                orderId: {
                  $contains: '',
                },
              },
            },
            populate: {
              order: true,
            },
          },
        );

        const orderTaxesAmount = taxReports?.reduce((acc, tax) => {
          return acc + (tax?.order?.tax || 0);
        }, 0);

        return orderTaxesAmount;
      },
    };
  },
);
