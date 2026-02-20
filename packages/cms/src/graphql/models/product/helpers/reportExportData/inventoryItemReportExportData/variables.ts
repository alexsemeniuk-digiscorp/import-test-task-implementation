export const inventoryItemReportExportDataProductFields = [
  'createdAt',
  'age',
  'soldDate',
  'grossMargin',
  'price',
  'memoTaken',
  'memoSold',
];

export const inventoryItemReportExportDataPopulation = {
  sellingOrder: {
    fields: ['orderId', 'customCreationDate'],
    populate: {
      contact: {
        fields: ['fullName', 'uuid'],
      },
      company: {
        fields: ['name', 'uuid'],
      },
    },
  },
  productInventoryItemEvent: {
    fields: [
      'change',
      'remainingQuantity',
      'itemCost',
      'receiveDate',
      'memoNumber',
    ],
    populate: {
      order: {
        fields: ['orderId', 'memoNumber'],
      },
      itemVendor: {
        fields: ['name', 'uuid'],
      },
      itemContactVendor: {
        fields: ['fullName', 'uuid'],
      },
    },
  },
  productInventoryItem: {
    fields: ['uuid', 'quantity', 'price'],
    populate: {
      businessLocation: {
        fields: ['uuid', 'name'],
      },
      product: {
        fields: [
          'uuid',
          'name',
          'SKU',
          'barcode',
          'model',
          'defaultPrice',
          'multiplier',
        ],
        populate: {
          productType: {
            fields: ['name'],
          },
          productInventoryItems: {
            fields: ['id'],
            populate: {
              businessLocation: {
                fields: ['id'],
              },
              productOrderItems: {
                fields: ['quantity'],
                populate: {
                  order: {
                    fields: ['type', 'status'],
                  },
                },
              },
            },
          },
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
