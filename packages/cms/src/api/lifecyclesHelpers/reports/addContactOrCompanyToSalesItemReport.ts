import { handleError, handleLogger } from '../../../graphql/helpers/errors';

export const addContactOrCompanyToSalesItemReport = async (
  event,
  currentOrder,
) => {
  try {
    handleLogger(
      'info',
      'ORDER afterUpdateLifecycleHook addContactOrCompanyToSalesItemReport',
      `Params :: ${JSON.stringify(event?.params)}`,
    );
    const contactId = currentOrder?.contact?.id;
    const companyId = currentOrder?.company?.id;
    const salesId = currentOrder?.sales?.id;

    const salesItemReports = await strapi.entityService.findMany(
      'api::sales-item-report.sales-item-report',
      {
        filters: {
          order: currentOrder?.id,
        },
        fields: ['id'],
        populate: {
          contact: {
            fields: ['id'],
          },
          company: {
            fields: ['id'],
          },
          sales: {
            fields: ['id'],
          },
        },
      },
    );

    if (!salesItemReports || !salesItemReports.length) return;

    const updateReports = salesItemReports.map(async (report) => {
      if (!report.contact?.id && contactId) {
        await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          report.id,
          {
            data: {
              contact: contactId,
            },
          },
        );
      }

      if (!report.company?.id && companyId) {
        await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          report.id,
          {
            data: {
              company: companyId,
            },
          },
        );
      }

      if (!report.sales?.id && salesId) {
        await strapi.entityService.update(
          'api::sales-item-report.sales-item-report',
          report.id,
          {
            data: {
              sales: salesId,
            },
          },
        );
      }
    });

    await Promise.all(updateReports);
  } catch (e) {
    handleError('addContactOrCompanyToSalesItemReport', undefined, e);
  }
};
