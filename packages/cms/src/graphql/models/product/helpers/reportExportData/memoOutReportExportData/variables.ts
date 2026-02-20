export const memoOutExportDataProductFields = [
  'id',
  'price',
  'quantity',
  'isPartiallyReturned',
  'isFullyReturned',
  'returnedDate',
  'reportNote',
];

export const memoOutExportDataPopulation = {
  order: {
    fields: [
      'id',
      'orderId',
      'createdAt',
      'expiryDate',
      'memo',
      'total',
      'type',
      'dueDate',
    ],
    populate: {
      contact: {
        fields: ['fullName', 'uuid'],
      },
      company: {
        fields: ['name', 'uuid'],
      },
      dealTransactions: {
        fields: ['status', 'summary', 'paid'],
        populate: {
          chartAccount: {
            fields: ['name'],
          },
        },
      },
    },
  },
  product: {
    populate: {
      product: {
        fields: ['name', 'uuid', 'SKU'],
        populate: {
          files: {
            fields: [
              'previewUrl',
              'alternativeText',
              'url',
              'size',
              'name',
              'mime',
            ],
          },
        },
      },
    },
  },
};

export type MemoOutReportWithOrder = {
  order?: {
    id?: string;
  };
} & Record<string, any>;
