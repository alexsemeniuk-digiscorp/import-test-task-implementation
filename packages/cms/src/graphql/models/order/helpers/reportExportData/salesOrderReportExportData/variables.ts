export const salesOrderReportExportDataOrderFields = [
  'orderId',
  'status',
  'total',
  'tip',
  'tax',
  'customCreationDate',
  'dueDate',
  'type',
  'shippedDate',
  'ecommerceType',
];

export const salesOrderReportExportDataPopulation = {
  contact: {
    fields: ['fullName'],
  },
  company: {
    fields: ['name'],
  },
  sales: {
    fields: ['firstName', 'lastName'],
  },
  salesItemReports: {
    fields: ['grossMargin'],
  },
  businessLocation: {
    fields: ['name'],
  },
  dealTransactions: {
    fields: ['status', 'summary', 'paid'],
    populate: {
      chartAccount: {
        fields: ['name'],
      },
    },
  },
  products: {
    fields: ['quantity', 'price', 'isCompositeProductItem'],
  },
  compositeProducts: {
    fields: ['quantity', 'price'],
  },
  services: {
    fields: ['quantity', 'price'],
  },
  memberships: {
    fields: ['quantity', 'price'],
  },
  classes: {
    fields: ['quantity', 'price'],
  },
};

export type SalesOrderReportWithSales = {
  sales?: {
    firstName?: string;
    lastName?: string;
  };
} & Record<string, any>;
