import Papa from 'papaparse';
import { escapeCsvField } from '../../../../../helpers/fileHelpers';
import {
  marketingReportExportDataMarketingFields,
  marketingReportExportDataPopulation,
} from './variables';

// csv helpers
export const getMarketingReportCSVHeaders = (): string[][] => {
  const csvHeaders = [
    ['CUSTOMER NAME', 'CAMPAIGN NAME', 'SMS SENT', 'EMAILS SENT'],
  ];

  return csvHeaders;
};

export const getMarketingReportCSVData = (report): string[] => {
  const customerFullName = escapeCsvField(
    report?.enrolledContact?.contact?.fullName ??
      report?.enrolledLead?.lead?.fullName ??
      '',
  );
  const campaignName = escapeCsvField(
    report?.enrolledContact?.campaign?.name ??
      report?.enrolledLead?.campaign?.name ??
      '',
  );

  return [
    customerFullName,
    campaignName,
    report?.SMSsent?.toString() ?? '',
    report?.EMAILsent?.toString() ?? '',
  ];
};

export const getMarketingReportCSVString = async (reports) => {
  const headers = getMarketingReportCSVHeaders()[0];
  const rows = reports.map((report) => getMarketingReportCSVData(report));

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

export const generateMarketingReportData = async (job) => {
  const marketingReportsData = await strapi.entityService.findMany(
    'api::marketing-customers-report.marketing-customers-report',
    {
      filters: {
        ...job?.data?.tenantFilter,
        ...job?.data?.reportFilter,
      },
      sort: ['createdAt:desc'],
      pagination: { limit: -1 },
      fields: marketingReportExportDataMarketingFields as any,
      populate: marketingReportExportDataPopulation as any,
    },
  );

  return marketingReportsData;
};

export const generateMarketingReportCSV = async (job) => {
  const marketingReportsData = await generateMarketingReportData(job);

  return getMarketingReportCSVString(marketingReportsData);
};
