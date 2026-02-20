export const memoInExportDataProductFields = [
  'eventType',
  'itemCost',
  'remainingQuantity',
  'change',
  'receiveDate',
  'expiryDate',
  'isPartiallyReturned',
  'isFullyReturned',
  'returnedDate',
  'isNotified',
  'memoNumber',
  'note',
];

export const memoInExportDataPopulation = {
  order: {
    fields: ['id', 'orderId', 'memoNumber'],
  },
  productInventoryItem: {
    populate: {
      businessLocation: {
        fields: ['uuid', 'name'],
      },
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
  itemContactVendor: {
    fields: ['fullName', 'uuid'],
  },
  itemVendor: {
    fields: ['name', 'uuid'],
  },
};
