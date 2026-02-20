export const inventoryReportExportDataProductFields = [
  'createdAt',
  'uuid',
  'barcode',
  'name',
  'SKU',
  'defaultPrice',
  'productId',
];

export const inventoryReportExportDataPopulation = {
  rentableData: {
    fields: ['enabled'],
  },
  productInventoryItems: {
    fields: ['quantity', 'price'],
    populate: {
      businessLocation: {
        fields: ['uuid', 'name'],
      },
      sublocationItems: {
        fields: ['quantity'],
        populate: {
          sublocation: {
            fields: ['id'],
          },
        },
      },
      productOrderItems: {
        fields: ['price', 'quantity'],
        populate: {
          order: {
            fields: ['type', 'status'],
          },
        },
      },
      product_inventory_item_events: {
        fields: ['itemCost', 'eventType'],
      },
    },
  },
  weight: {
    fields: ['value', 'unit'],
  },
  productType: {
    fields: ['name'],
  },
  files: {
    fields: ['previewUrl', 'alternativeText', 'url', 'size', 'name', 'mime'],
  },
};
