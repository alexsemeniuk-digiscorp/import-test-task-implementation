export const marketingReportExportDataMarketingFields = [
  'SMSsent',
  'EMAILsent',
];

export const marketingReportExportDataPopulation = {
  enrolledContact: {
    populate: {
      contact: {
        fields: ['fullName'],
      },
      campaign: {
        fields: ['name'],
      },
    },
  },
  enrolledLead: {
    populate: {
      lead: {
        fields: ['fullName'],
      },
      campaign: {
        fields: ['name'],
      },
    },
  },
};
